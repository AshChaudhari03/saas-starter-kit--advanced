const { stripe, PRODUCTS } = require('../config/stripe');
const User = require('../models/User');

// Create Stripe checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    console.log('Creating checkout session for user:', req.user.id);
    console.log('Request body:', req.body);
    
    const { priceId, successUrl, cancelUrl } = req.body;
    const userId = req.user.id;

    // Validate priceId
    if (!priceId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Price ID is required' 
      });
    }

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    console.log('Found user:', user.email);

    let customerId = user.subscription?.stripeCustomerId;

    // Create new Stripe customer if doesn't exist
    if (!customerId) {
      console.log('Creating new Stripe customer for:', user.email);
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: userId.toString()
          }
        });
        customerId = customer.id;
        console.log('Created customer:', customerId);
        
        // Save customer ID to user
        if (!user.subscription) {
          user.subscription = {};
        }
        user.subscription.stripeCustomerId = customerId;
        await user.save();
      } catch (customerError) {
        console.error('Stripe customer creation error:', customerError);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to create customer',
          message: customerError.message 
        });
      }
    } else {
      console.log('Using existing customer:', customerId);
    }

    // Create checkout session
    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: priceId.includes('lifetime') ? 'payment' : 'subscription',
      success_url: 'https://psychic-barnacle-66w779qjp4x2rp45-3000.app.github.dev/success?payment=success&session_id={CHECKOUT_SESSION_ID}&customer_id={CUSTOMER_ID}',
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'https://psychic-barnacle-66w779qjp4x2rp45-3000.app.github.dev'}/pricing?payment=canceled`,
      metadata: {
        userId: userId.toString(),
        priceId: priceId
      }
    });

    console.log('Checkout session created:', session.id);

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create checkout session',
      message: error.message,
      type: error.type
    });
  }
};
// Update user subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { status, plan } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Initialize subscription object if it doesn't exist
    if (!user.subscription) {
      user.subscription = {};
    }

    // Update subscription fields
    user.subscription.status = status || user.subscription.status;
    user.subscription.plan = plan || user.subscription.plan;
    user.subscription.updatedAt = new Date();

    await user.save();

    res.json({
      success: true,
      message: 'Subscription updated',
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
// Get user's subscription status
exports.getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription');
    
    res.json({
      success: true,
      subscription: user.subscription || {}
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get subscription status' 
    });
  }
};

// Get available plans
exports.getPlans = async (req, res) => {
  try {
    const plans = Object.entries(PRODUCTS).map(([key, plan]) => ({
      id: key,
      name: plan.name,
      price: plan.price,
      interval: plan.interval,
      priceId: plan.priceId
    }));

    res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get plans' 
    });
  }
};

// Webhook handler for Stripe events
exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret'
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment succeeded for session:', session.id);
      
      // Update user subscription in database
      try {
        const userId = session.metadata.userId;
        const user = await User.findById(userId);
        
        if (user) {
          user.subscription = {
            status: 'active',
            plan: 'basic', // You can determine this from priceId
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            currentPeriodEnd: new Date(session.subscription_details.current_period_end * 1000)
          };
          await user.save();
          console.log('Updated user subscription for:', user.email);
        }
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

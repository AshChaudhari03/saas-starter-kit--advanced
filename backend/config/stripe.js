const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product and price IDs for your SaaS
const PRODUCTS = {
  basic: {
    priceId: 'price_1SfEHGFknHHEUlv9F35lkDOU', // Your actual Basic price ID
    name: 'Best Value',
    price: 9,
    interval: 'month'
  },
  pro: {
    priceId: 'price_1SfEHwFknHHEUlv9CfMXrmL3', // Your actual Pro price ID
    name: 'Pro Plan',
    price: 18,
    interval: 'month'
  },
  lifetime: {
    priceId: 'price_1SfEIFFknHHEUlv9BLidEDic', // Your actual Lifetime price ID
    name: 'Life time',
    price: 41,
    interval: 'one-time'
  }
};

// Test Stripe connection on startup
(async () => {
  try {
    if (process.env.STRIPE_SECRET_KEY) {
      const balance = await stripe.balance.retrieve();
      console.log('✅ Stripe connected successfully');
      console.log('💰 Available balance:', balance.available[0]?.amount || 0, balance.available[0]?.currency || 'USD');
    } else {
      console.log('⚠️  STRIPE_SECRET_KEY not found in .env');
    }
  } catch (error) {
    console.error('❌ Stripe connection failed:', error.message);
  }
})();

module.exports = { stripe, PRODUCTS };

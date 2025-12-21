import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { stripeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Pricing.css';

const stripePromise = loadStripe('pk_live_51SaRSaFknHHEUlv96eitHoljQD3i93kZo3tZrtYQWrUCyh8XCsbkhMEryFKdaJjp0Pr8a3epJePL4li4F4NWiczw00NykROkUo'); // Replace with your key

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadPlans();
    loadSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await stripeAPI.getPlans();
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscription = async () => {
    if (!user) return;
    try {
      const response = await stripeAPI.getSubscription();
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const handleSubscribe = async (priceId) => {
    try {
      setLoading(true);
      const response = await stripeAPI.createCheckoutSession({
        priceId,
        successUrl: window.location.origin + '/dashboard?payment=success',
        cancelUrl: window.location.origin + '/pricing'
      });

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (error) {
        console.error('Stripe error:', error);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading plans...</div>;
  }

  return (
    <div className="pricing-container">
      <div className="container">
        <h1 className="pricing-title">Choose Your Plan</h1>
        <p className="pricing-subtitle">Start building your SaaS today</p>
        
        {subscription?.status === 'active' && (
          <div className="alert alert-success">
            🎉 You have an active {subscription.plan} subscription
          </div>
        )}

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.id === 'pro' ? 'featured' : ''}`}>
              {plan.id === 'pro' && <div className="popular-badge">MOST POPULAR</div>}
              
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">{plan.price}</span>
                <span className="period">/{plan.interval}</span>
              </div>
              
              <ul className="features">
                <li>✅ Complete SaaS Starter Kit</li>
                <li>✅ User Authentication</li>
                <li>✅ JWT & Protected Routes</li>
                <li>✅ MongoDB Database</li>
                <li>✅ React Dashboard</li>
                {plan.id === 'pro' && <li>✅ Priority Support</li>}
                {plan.id === 'lifetime' && <li>✅ Lifetime Updates</li>}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan.priceId)}
                className={`btn ${plan.id === 'pro' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={loading}
              >
                {subscription?.plan === plan.id ? 'Current Plan' : `Get ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;

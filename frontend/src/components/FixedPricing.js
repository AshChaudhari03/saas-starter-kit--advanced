import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const FixedPricing = () => {
  const [loading, setLoading] = useState(false);
  
  // IMPORTANT: Use TEST key while developing
  const stripePromise = loadStripe('pk_test_51SaRSaFknHHEUlv96eitHoljQD3i93kZo3tZrtYQWrUCyh8XCsbkhMEryFKdaJjp0Pr8a3epJePL4li4F4NWiczw00NykROkUo');
  const API_URL = process.env.REACT_APP_API_URL || 'https://psychic-barnacle-66w779qjp4x2rp45-5000.app.github.dev/api';
  // Plans MUST match your backend stripe.js EXACTLY
  const plans = [
    { 
      id: 'basic', 
      name: 'Best Value',  // Match backend name
      price: 9,            // Match backend price: $9
      period: 'month',
      priceId: 'price_1SfEHGFknHHEUlv9F35lkDOU' // Your actual price ID
    },
    { 
      id: 'pro', 
      name: 'Pro Plan',    // Match backend name
      price: 18,           // Match backend price: $18
      period: 'month',
      priceId: 'price_1SfEHwFknHHEUlv9CfMXrmL3' // Your actual price ID
    },
    { 
      id: 'lifetime', 
      name: 'Life time',   // Match backend name (note space)
      price: 41,           // Match backend price: $41
      period: 'one-time',
      priceId: 'price_1SfEIFFknHHEUlv9BLidEDic' // Your actual price ID
    }
  ];

  // Function to handle Basic Plan button click ONLY
    // Function to handle Basic Plan button click ONLY
  const handleBasicPlanClick = async () => {
    setLoading(true);
    console.log('Starting payment for Basic Plan...');
    
    try {
      // 1. Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first!');
        window.location.href = '/login';
        return;
      }
      
      // 2. Use YOUR backend URL
      const backendUrl = 'https://psychic-barnacle-66w779qjp4x2rp45-5000.app.github.dev';
      
      console.log('Calling backend at:', backendUrl);
      const response = await fetch(`${backendUrl}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          priceId: plans[0].priceId, // Basic plan price ID
          successUrl: 'https://psychic-barnacle-66w779qjp4x2rp45-3000.app.github.dev/success?payment=success&session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin + '/pricing'
        })
      });
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Backend response:', data);
      
      if (data.success && data.url) {
        // 3. Redirect to Stripe Checkout
        console.log('Redirecting to Stripe...');
        window.location.href = data.url; // Simple redirect
      } else {
        console.error('Backend error:', data);
        alert('Failed: ' + (data.message || 'Check console for details'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message + '\n\nMake sure backend is running at port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Different click handlers for each button
  const handleButtonClick = (planId) => {
    console.log('Clicked plan:', planId);
    
    if (planId === 'basic') {
      handleBasicPlanClick();
    } else {
      // For Pro and Lifetime - show message
      alert(`🚧 Coming soon! Test with Basic Plan first.\n\nPlan: ${plans.find(p => p.id === planId)?.name}\nPrice: $${plans.find(p => p.id === planId)?.price}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose Your Plan</h1>
      <p style={styles.subtitle}>Start building your SaaS today</p>
      
      {loading && (
        <div style={styles.loading}>
          ⏳ Redirecting to Stripe...
        </div>
      )}
      
      <div style={styles.plansContainer}>
        {plans.map(plan => (
          <div key={plan.id} style={{
            ...styles.planCard,
            border: plan.id === 'basic' ? '2px solid #667eea' : '1px solid #ddd'
          }}>
            <h3 style={styles.planName}>{plan.name}</h3>
            <div style={styles.price}>
              ${plan.price}
              <span style={styles.period}>/{plan.period}</span>
            </div>
            
            <ul style={styles.features}>
              <li>✅ Complete SaaS Kit</li>
              <li>✅ User Authentication</li>
              <li>✅ JWT & Protected Routes</li>
              <li>✅ MongoDB Database</li>
              <li>✅ React Dashboard</li>
            </ul>
            
            <button 
              style={{
                ...styles.button,
                background: plan.id === 'basic' ? '#667eea' : '#718096',
                opacity: loading && plan.id === 'basic' ? 0.7 : 1
              }}
              onClick={() => handleButtonClick(plan.id)}
              disabled={loading && plan.id === 'basic'}
            >
              {loading && plan.id === 'basic' ? 'Processing...' : `Get ${plan.name}`}
            </button>
            
            {plan.id === 'basic' && (
              <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
                <p>⚡ Test card: 4242 4242 4242 4242</p>
                <p>💡 Any future date, any CVC</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={styles.infoBox}>
        <p><strong>Note:</strong> Only Basic Plan is active for testing</p>
        <p>Prices are in AUD (Australian Dollars)</p>
      </div>
      
      <p style={styles.footer}>
        All plans include source code and documentation
      </p>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    textAlign: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa'
  },
  title: {
    fontSize: '48px',
    color: '#333',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '50px'
  },
  loading: {
    background: '#ffeaa7',
    padding: '15px',
    borderRadius: '8px',
    margin: '20px auto',
    maxWidth: '400px'
  },
  plansContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: '30px',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  planCard: {
    background: 'white',
    padding: '40px 30px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s'
  },
  planName: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px'
  },
  price: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#667eea',
    margin: '30px 0'
  },
  period: {
    fontSize: '16px',
    color: '#666',
    marginLeft: '5px'
  },
  features: {
    listStyle: 'none',
    padding: '0',
    margin: '30px 0',
    textAlign: 'left',
    flexGrow: 1
  },
  featuresLi: {
    padding: '10px 0',
    color: '#555',
    borderBottom: '1px solid #eee'
  },
  button: {
    marginTop: '20px',
    padding: '15px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    width: '100%',
    transition: 'background 0.3s'
  },
  infoBox: {
    background: '#e3f2fd',
    padding: '20px',
    borderRadius: '10px',
    margin: '40px auto',
    maxWidth: '500px'
  },
  footer: {
    marginTop: '30px',
    color: '#666',
    fontSize: '14px'
  }
};

// Add li styles
styles.features.li = styles.featuresLi;

export default FixedPricing;
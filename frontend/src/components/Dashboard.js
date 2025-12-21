import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    const checkPaymentSuccess = async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentSuccess = params.get('payment');
      
      if (paymentSuccess === 'success') {
        console.log('Payment success detected in URL');
        await updateSubscriptionStatus();
      }
      
      await loadSubscription();
    };
    
    checkPaymentSuccess();
  }, []);

  const loadSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('https://psychic-barnacle-66w779qjp4x2rp45-5000.app.github.dev/api/stripe/subscription', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Subscription data:', data);
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const updateSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams(window.location.search);
      const paymentSuccess = params.get('payment');
      
      if (paymentSuccess === 'success') {
        console.log('Payment success detected, marking as active...');
        
        // For now, update local state
        setSubscription(prev => ({
          ...prev,
          status: 'active',
          plan: 'basic'
        }));
        
        // Clear URL parameter
        window.history.replaceState({}, '', '/dashboard');
        
        alert('🎉 Payment Successful! Your subscription is now active.');
      }
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <header className="dashboard-header">
        <h1>🚀 SaaS Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div>
            <span>Welcome, <strong>{user?.name}</strong></span>
            {(subscription?.status === 'active' || subscription?.stripeCustomerId) && (
              <span style={{
                marginLeft: '10px',
                background: '#28a745',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                ⭐ PRO USER
              </span>
            )}
          </div>
          {/* <button onClick={handleLogout} className="btn btn-secondary">Logout</button> */}
        </div>
      </header>

      <main style={{ padding: '40px 0' }}>
        {/* Payment Status Card */}
        {loadingSubscription ? (
          <div className="dashboard-card">
            <p>Loading subscription status...</p>
          </div>
        ) : (subscription?.status === 'active' || subscription?.stripeCustomerId) ? (
          <div className="dashboard-card" style={{background: '#d4edda', border: '2px solid #28a745'}}>
            <h3>✅ Payment Verified!</h3>
            <p><strong>Stripe Customer:</strong> Yes {subscription?.stripeCustomerId && `(ID: ${subscription.stripeCustomerId.substring(0, 10)}...)`}</p>
            <p><strong>Access Level:</strong> Full SaaS Starter Kit</p>
            <button className="btn" style={{background: '#28a745', marginTop: '10px'}}>
              ⭐ Download Your Kit
            </button>
          </div>
        ) : (
          <div className="dashboard-card">
            <h3>💰 Get Full Access</h3>
            <p>Upgrade to unlock the complete SaaS Starter Kit</p>
            <button className="btn" onClick={() => window.location.href = '/pricing'}>
              View Pricing Plans
            </button>
          </div>
        )}

        {/* User Info Card */}
        <div className="dashboard-card">
          <h3>👤 Your Account Information</h3>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px',
            borderRadius: '5px',
            marginTop: '15px'
          }}>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Account Created:</strong> {formatDate(user?.createdAt)}</p>
            {user?.id && (
              <p><strong>User ID:</strong> <code>{user.id.substring(0, 10)}...</code></p>
            )}
          </div>
        </div>

        {/* Features Status Card */}
        <div className="dashboard-card">
          <h3>🚀 Your SaaS Starter Kit Includes:</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{
              background: '#e3f2fd',
              padding: '20px',
              borderRadius: '5px'
            }}>
              <h4 style={{ color: '#1976d2' }}>✅ Authentication</h4>
              <p>User registration, login, JWT tokens, protected routes</p>
            </div>
            
            <div style={{
              background: '#f3e5f5',
              padding: '20px',
              borderRadius: '5px'
            }}>
              <h4 style={{ color: '#7b1fa2' }}>✅ Payments</h4>
              <p>Stripe integration, 3 pricing plans, test mode working</p>
            </div>
            
            <div style={{
              background: '#e8f5e9',
              padding: '20px',
              borderRadius: '5px'
            }}>
              <h4 style={{ color: '#388e3c' }}>✅ Dashboard</h4>
              <p>React interface, user management, responsive design</p>
            </div>
          </div>
          
          {(subscription?.status === 'active' || subscription?.stripeCustomerId) && (
            <div style={{
              background: '#fff3cd',
              padding: '15px',
              borderRadius: '5px',
              marginTop: '20px',
              border: '1px solid #ffeaa7'
            }}>
              <h4 style={{ color: '#856404', marginBottom: '10px' }}>🎉 Ready to Sell!</h4>
              <p>Your SaaS Starter Kit is <strong>complete and ready to sell</strong> on Gumroad!</p>
              <button 
                className="btn" 
                style={{background: '#6f42c1', marginTop: '10px'}}
                onClick={() => alert('Next: We\'ll set up your Gumroad listing!')}
              >
                🚀 Prepare Gumroad Listing
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

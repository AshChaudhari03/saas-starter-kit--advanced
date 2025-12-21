import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Success page loaded');
    console.log('Full URL:', window.location.href);
    console.log('Search params:', location.search);
    
    // Check for payment success parameters
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment');
    const sessionId = params.get('session_id');

    console.log('Payment status:', paymentStatus);
    console.log('Session ID:', sessionId);
    
    if (paymentStatus === 'success' && sessionId) {
      console.log('✅ Payment successful detected');
      
      // Check localStorage
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('Token in localStorage:', token ? 'Exists' : 'Missing');
      console.log('User in localStorage:', storedUser ? 'Exists' : 'Missing');
      
       if (token) {
      if (storedUser) {
        // Case 1: Both token and user exist - redirect to dashboard
        console.log('✅ Both token and user exist, redirecting to dashboard');
        window.location.href = '/dashboard?payment=success&session=' + sessionId;
      } else {
        // Case 2: Token exists but user doesn't - fetch user data
        console.log('⚠️ Token exists but user missing, fetching user...');
        fetchUserAndRedirect(token, sessionId);
      }
    } else {
      // Case 3: No token - redirect to login
      console.log('❌ No token, redirecting to login');
      window.location.href = '/login?payment=success&session=' + sessionId;
    }
  } else {
    navigate('/pricing');
  }
}, [navigate, location]);
// Function to fetch user data
const fetchUserAndRedirect = async (token, sessionId) => {
  try {
    console.log('Fetching user profile with token...');
    const response = await fetch('https://psychic-barnacle-66w779qjp4x2rp45-5000.app.github.dev/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('User fetched:', data.user);
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard?payment=success&session=' + sessionId;
    } else {
      // Token might be invalid, go to login
      localStorage.removeItem('token');
      window.location.href = '/login?payment=success&session=' + sessionId;
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    window.location.href = '/login?payment=success&session=' + sessionId;
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🎉</div>
        <h1>Payment Successful!</h1>
        <p>Your SaaS Starter Kit subscription is now active.</p>
        <p style={styles.message}>Processing your subscription...</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%'
  },
  icon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  loading: {
    color: '#666',
    fontStyle: 'italic',
    margin: '20px 0'
  },
  details: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee'
  },
  button: {
    margin: '10px',
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600'
  }
};

export default Success;

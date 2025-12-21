import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Pricing from './components/FixedPricing';
import AdminDashboard from './AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
import './index.css';

const MainLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const isAdminUser = user?.email === 'admin@saaskit.com' || user?.email === 'ash@example.com';

  // If not authenticated, show login/register
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Left side - Brand/Info */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🚀 SaaS Starter Kit</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '30px' }}>
            Complete React/Node.js boilerplate with authentication, payments, and dashboard.
          </p>
          <div style={{ marginTop: '40px' }}>
            <h3>✅ Everything Included:</h3>
            <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
              <li>User Authentication (JWT)</li>
              <li>Stripe Payment Integration</li>
              <li>MongoDB Database</li>
              <li>React Dashboard</li>
              <li>Admin Panel</li>
              <li>Ready to Deploy</li>
            </ul>
          </div>
        </div>
        
        {/* Right side - Auth Forms */}
        <div style={{
          flex: 1,
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {activeView === 'login' ? (
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <Login onSwitchToRegister={() => setActiveView('register')} />
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <Register onSwitchToLogin={() => setActiveView('login')} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // If authenticated, show the main app with navigation
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <div style={{
        width: '250px',
        background: '#2d3748',
        color: 'white',
        padding: '20px 0'
      }}>
        <div style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '30px', color: '#a0aec0' }}>🚀 SaaS Kit</h2>
          
          <div style={{ marginBottom: '30px', padding: '15px', background: '#4a5568', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#a0aec0' }}>Logged in as</div>
            <div style={{ fontWeight: 'bold', marginTop: '5px' }}>{user?.name}</div>
            <div style={{ fontSize: '12px', color: '#a0aec0' }}>{user?.email}</div>
          </div>

          <nav>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#a0aec0', padding: '0 20px', marginBottom: '10px' }}>MAIN</div>
              <button
                onClick={() => setActiveView('dashboard')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 20px',
                  background: activeView === 'dashboard' ? '#4a5568' : 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveView('pricing')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 20px',
                  background: activeView === 'pricing' ? '#4a5568' : 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                💰 Pricing
              </button>
            </div>

            {isAdminUser && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#a0aec0', padding: '0 20px', marginBottom: '10px' }}>ADMIN</div>
                <button
                  onClick={() => setActiveView('admin')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 20px',
                    background: activeView === 'admin' ? '#4a5568' : 'transparent',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  ⚡ Admin Panel
                </button>
              </div>
            )}

            <div style={{ marginTop: '30px', padding: '0 20px' }}>
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, background: '#f7fafc', overflowY: 'auto' }}>
        <div style={{ padding: '30px' }}>
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'pricing' && <Pricing />}
          {activeView === 'admin' && <AdminDashboard />}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

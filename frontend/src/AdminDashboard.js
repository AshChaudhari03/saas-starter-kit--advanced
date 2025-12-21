import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Loading users with token:', token?.substring(0, 20) + '...');
    
    const response = await fetch('https://psychic-barnacle-66w779qjp4x2rp45-5000.app.github.dev/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('API Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Users data received:', data);
      
      setUsers(data.users || []);
      setStats({
        totalUsers: data.stats?.totalUsers || 0,
        activeSubscriptions: data.stats?.activeSubscriptions || 0,
        totalRevenue: data.stats?.estimatedRevenue || 0
      });
    } else {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      
      // Fallback to mock data if API fails
      setUsers([
        { _id: '1', email: 'admin@saaskit.com', name: 'System Admin', role: 'admin', createdAt: new Date().toISOString() },
        { _id: '2', email: 'ash@example.com', name: 'Ash Chaudhari', role: 'user', createdAt: new Date().toISOString(), subscription: { status: 'active', plan: 'basic', stripeCustomerId: 'cus_TcS0dS9M98aX1D' } }
      ]);
      
      setStats({
        totalUsers: 2,
        activeSubscriptions: 1,
        totalRevenue: 9
      });
    }
  } catch (error) {
    console.error('Failed to load users:', error);
    // Show mock data
    setUsers([
      { _id: '1', email: 'admin@saaskit.com', name: 'System Admin', role: 'admin', createdAt: new Date().toISOString() },
      { _id: '2', email: 'ash@example.com', name: 'Ash Chaudhari', role: 'user', createdAt: new Date().toISOString(), subscription: { status: 'active', plan: 'basic', stripeCustomerId: 'cus_TcS0dS9M98aX1D' } }
    ]);
    
    setStats({
      totalUsers: 2,
      activeSubscriptions: 1,
      totalRevenue: 9
    });
  } finally {
    setLoading(false);
  }
};
const makeAdmin = async (userId) => {
  if (!window.confirm('Make this user an admin?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://psychic-barnacle-66w779qjp4x2rp45-5000.app.github.dev/api/admin/make-admin/${userId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      alert(`✅ ${data.message}`);
      loadUsers(); // Reload the user list
    } else {
      const errorData = await response.json();
      alert(`❌ Failed: ${errorData.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Failed to make admin:', error);
    alert('❌ Network error. Please try again.');
  }
};
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };



  if (loading) {
    return (
      <div className="container">
        <div className="dashboard-card">
          <h3>Loading Admin Dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="dashboard-header">
        <h1>⚡ Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Admin: <strong>{user?.name}</strong></span>
          <button onClick={() => window.location.href = '/dashboard'} className="btn" style={{marginRight: '10px'}}>
            User Dashboard
          </button>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        margin: '30px 0'
      }}>
        <div className="dashboard-card" style={{background: '#e3f2fd'}}>
          <h3>👥 Total Users</h3>
          <div style={{fontSize: '48px', fontWeight: 'bold', color: '#1976d2'}}>
            {stats.totalUsers}
          </div>
        </div>
        
        <div className="dashboard-card" style={{background: '#e8f5e9'}}>
          <h3>💰 Active Subscriptions</h3>
          <div style={{fontSize: '48px', fontWeight: 'bold', color: '#388e3c'}}>
            {stats.activeSubscriptions}
          </div>
        </div>
        
        <div className="dashboard-card" style={{background: '#fff3cd'}}>
          <h3>📈 Estimated Revenue</h3>
          <div style={{fontSize: '48px', fontWeight: 'bold', color: '#f57c00'}}>
            ${stats.totalRevenue}
          </div>
          <p style={{fontSize: '14px', color: '#666'}}>Monthly (Test Mode)</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="dashboard-card">
        <h3>👤 User Management</h3>
        <div style={{overflowX: 'auto', marginTop: '20px'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{background: '#f5f5f5'}}>
                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>Name</th>
                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>Email</th>
                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>Role</th>
                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>Subscription</th>
                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>Joined</th>
                <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '12px'}}>{user.name}</td>
                  <td style={{padding: '12px'}}>{user.email}</td>
                  <td style={{padding: '12px'}}>
                    <span style={{
                      background: user.role === 'admin' ? '#dc3545' : '#6c757d',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{padding: '12px'}}>
                    {user.subscription?.status === 'active' ? (
                      <span style={{color: '#28a745', fontWeight: 'bold'}}>✅ Active</span>
                    ) : (
                      <span style={{color: '#6c757d'}}>Inactive</span>
                    )}
                  </td>
                  <td style={{padding: '12px'}}>{formatDate(user.createdAt)}</td>
                  <td style={{padding: '12px'}}>
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => makeAdmin(user._id)}
                        style={{
                          padding: '6px 12px',
                          background: '#6f42c1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card">
        <h3>⚡ Quick Actions</h3>
        <div style={{display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap'}}>
          <button className="btn" style={{background: '#28a745'}}>
            📥 Export Users CSV
          </button>
          <button className="btn" style={{background: '#17a2b8'}}>
            📧 Send Email to All
          </button>
          <button className="btn" style={{background: '#ffc107', color: '#000'}}>
            🔄 Refresh Data
          </button>
          <button className="btn" style={{background: '#dc3545'}} onClick={loadUsers}>
            📊 Reload Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
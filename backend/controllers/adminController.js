const User = require('../models/User');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    // Get all users (excluding passwords)
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    
    // Format users for frontend
    const formattedUsers = users.map(user => ({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      subscription: user.subscription || {}
    }));

    res.json({
      success: true,
      users: formattedUsers,
      stats: {
        totalUsers: users.length,
        activeSubscriptions: users.filter(u => u.subscription?.status === 'active').length,
        totalRevenue: users.filter(u => u.subscription?.status === 'active').length * 9 // $9 per user
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Make user admin
exports.makeAdmin = async (req, res) => {
  try {
    // Check if requester is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { userId } = req.params;
    
    // Update user role
    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User promoted to admin',
      user: user
    });

  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await User.countDocuments({ 'subscription.status': 'active' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeSubscriptions,
        totalAdmins,
        recentUsers,
        estimatedRevenue: activeSubscriptions * 9 // $9 per active user
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
};
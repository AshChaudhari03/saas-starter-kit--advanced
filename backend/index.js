// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Create Express application
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Import routes
const authRoutes = require('./routes/authRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const adminRoutes = require('./routes/adminRoutes');
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);

// Database connection
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saasdb')
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Define a basic test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 SaaS Starter Kit Backend is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Set the port (use environment variable or default to 5000)
const PORT = process.env.PORT || 5000;



// Protected route example (requires authentication)
app.get('/api/auth/me', require('./middleware/authMiddleware').authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Protected route accessed successfully',
    user: req.user
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});
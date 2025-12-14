// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Create Express application
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

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

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});
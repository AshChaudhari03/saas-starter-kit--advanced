const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find your user by email
    const userEmail = 'ash@example.com'; // Your email
    const user = await User.findOne({ email: userEmail });
    
    if (user) {
      // Update to admin
      user.role = 'admin';
      await user.save();
      console.log('✅ User updated to admin:', user.email);
      console.log('New role:', user.role);
    } else {
      console.log('❌ User not found:', userEmail);
      // Create admin user if doesn't exist
      const adminUser = new User({
        email: 'admin@saaskit.com',
        name: 'Admin User',
        password: '$2a$10$SomeHashedPassword', // You'll need to hash a password
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Admin user created');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

makeAdmin();
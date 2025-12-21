const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@saaskit.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      // Update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated to admin role');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = new User({
        email: 'admin@saaskit.com',
        name: 'System Admin',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@saaskit.com');
      console.log('Password: admin123');
      console.log('Role: admin');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();
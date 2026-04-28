import mongoose from 'mongoose';
import User from '../models/User.js';
import config from '../config/env.js';

// Admin credentials are sourced from environment config so they stay in sync
// with the values used by the running application.
const ADMIN_DATA = {
  name: 'Admin User',
  email: config.admin.email,
  password: config.admin.password,
  role: 'admin',
  phone: '9876543210',
  address: {
    village: 'Admin Office',
    district: 'Delhi',
    state: 'Delhi',
    pincode: '110001'
  }
};

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_DATA.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', ADMIN_DATA.email);
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create(ADMIN_DATA);
    
    console.log('✅ Admin user created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', ADMIN_DATA.password);
    console.log('👤 Role:', adminUser.role);
    console.log('📱 Phone:', adminUser.phone);
    console.log('═══════════════════════════════════════');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('🚀 You can now login at: http://localhost:5173/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

// Run the script
createAdminUser();

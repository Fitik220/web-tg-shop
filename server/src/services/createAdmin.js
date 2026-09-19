require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

async function createAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  await connectDB();

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (existingAdmin) {
    console.log(`Admin already exists: ${existingAdmin.email}`);
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create({
    name: 'Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });

  console.log(`Admin created: ${admin.email}`);
  await mongoose.disconnect();
}

createAdmin().catch((error) => {
  console.error('Failed to create admin:', error.message);
  process.exit(1);
});

const User = require('../models/User');

const seedAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      existingAdmin.department = existingAdmin.department || 'Administration';
      existingAdmin.designation = existingAdmin.designation || 'System Admin';
    }

    existingAdmin.password = adminPassword;
    await existingAdmin.save();
    return;
  }

  const admin = new User({
    firstName: 'Admin',
    lastName: 'User',
    email: adminEmail,
    password: adminPassword,
    department: 'Administration',
    designation: 'System Admin',
    role: 'admin'
  });

  await admin.save();
};

module.exports = seedAdminUser;
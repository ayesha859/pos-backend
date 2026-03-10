const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// 1. Import our new models and bcrypt for the Admin setup
const User = require('./models/User');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

// 2. Import ALL of your routes!
const userRoutes = require('./routes/userRoutes'); // 🌟 NEW: Import User Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const branchRoutes = require('./routes/branchRoutes');
app.use('/api/users', userRoutes); // 🌟 NEW: Tells the server to listen to /api/users // <-- NEW: Added Branch Routes

// 3. The Admin Seeder Function
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'atanver2233@gmail.com' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Super Admin',
        email: 'atanver2233@gmail.com',
        password: '12345678',
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Default admin account created successfully!');
    } else {
      console.log('⚡ Admin account already exists.');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    seedAdmin(); 
  })
  .catch((err) => console.log('❌ MongoDB Connection Error: ', err));

// 4. Tell the app to use ALL the routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);     
app.use('/api/orders', orderRoutes);  
app.use('/api/branches', branchRoutes); // <-- NEW: Tells the server to listen to /api/branches

app.get('/', (req, res) => {
  res.send('POS Backend is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running and accessible on network port ${PORT}`);
});
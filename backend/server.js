const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const memoryRoutes = require('./routes/memories');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LegacyLens API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/memories', memoryRoutes);

// Start server with MongoDB
async function startServer() {
  try {
    let mongoUri = process.env.MONGO_URI;

    // If local MongoDB is not available, use in-memory server
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log('✅ Connected to MongoDB (local/cloud)');
    } catch {
      console.log('⚠️  Local MongoDB not available. Starting in-memory database...');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to In-Memory MongoDB');
      console.log('   ⚠️  Data will be lost on server restart');
    }

    app.listen(PORT, () => {
      console.log(`🚀 LegacyLens API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from './config/config.js';

// Load environment variables
dotenv.config();

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', config.mongodbUri);

// Connect to MongoDB
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log('MongoDB connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 
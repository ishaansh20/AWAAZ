import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import complaintRoutes from './src/routes/complaintRoutes.js';

// Import middleware
import { errorHandler } from './src/middleware/errorMiddleware.js';

// Import config
import config from './src/config/config.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = config.port;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Awaaz API is running...');
});

// Undefined routes
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

// Global error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
}); 
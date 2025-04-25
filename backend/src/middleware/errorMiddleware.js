import config from '../config/config.js';

// Handle development errors
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Handle production errors
const sendProdError = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

// Handle MongoDB duplicate key error
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${value}. Please use another value for ${field}.`;
  return { statusCode: 400, status: 'fail', message, isOperational: true };
};

// Handle MongoDB validation error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return { statusCode: 400, status: 'fail', message, isOperational: true };
};

// Handle JWT errors
const handleJWTError = () => ({
  statusCode: 401,
  status: 'fail',
  message: 'Invalid token. Please log in again.',
  isOperational: true
});

const handleJWTExpiredError = () => ({
  statusCode: 401,
  status: 'fail',
  message: 'Your token has expired. Please log in again.',
  isOperational: true
});

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.nodeEnv === 'development') {
    sendDevError(err, res);
  } else if (config.nodeEnv === 'production') {
    let error = { ...err };
    error.message = err.message;
    
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    
    sendProdError(error, res);
  }
}; 
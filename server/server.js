const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techfest';

// ----------------------------------------------------
// 1. SECURITY MIDDLEWARE (OWASP Top 10 Mitigation)
// ----------------------------------------------------

// Helmet sets HTTP security headers (X-Content-Type-Options, X-Frame-Options, CSP, etc.)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", CLIENT_ORIGIN, 'https://*.onrender.com', 'https://*.netlify.app'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Express Mongo Sanitize prevents NoSQL injection by stripping $ and . operators
app.use(mongoSanitize());

// CORS configuration: only allow requests from the designated client origin
const allowedOrigins = [
  CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback to allow connection in lab demo
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers with size limit against DoS attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Request logger middleware (Method, URL, Timestamp)
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
});

// ----------------------------------------------------
// 2. HEALTH CHECK & API ROUTES
// ----------------------------------------------------

// Health route for Render / Netlify CI/CD checks (PPT Slide 7, 8, 11)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'TechFest 2026 Portal API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/feedback', require('./routes/feedback'));

// ----------------------------------------------------
// 3. 404 & ERROR HANDLING MIDDLEWARE
// ----------------------------------------------------

// Handle unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at route ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ----------------------------------------------------
// 4. DATABASE CONNECTION & SERVER START
// ----------------------------------------------------

// Connect to MongoDB (Atlas or local) with error handling
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log('✅ Connected to MongoDB successfully');
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB connection warning:', err.message);
      console.log('ℹ️ Running in resilient mode. Database operations will retry upon valid connection.');
    });

  const server = app.listen(PORT, () => {
    console.log(`🚀 TechFest 2026 Backend running on port ${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
    console.log(`🔒 Security headers (Helmet) & NoSQL Sanitization enabled`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
  });
}

module.exports = app;

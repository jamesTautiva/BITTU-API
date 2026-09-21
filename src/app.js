require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.set('view engine', 'ejs'); // Configura EJS
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // Para CSS/JS estático
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Para imágenes subidas

// Dynamic CORS configuration based on environment
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? ['https://bittu-cloud.netlify.app', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001']
      : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://localhost:5173'];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
        return res.render('index');
});

// Health check endpoint (no DB access) — devuelve 200 si el servidor está arriba
app.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Mount API routes
const routes = require('./routes');
app.use('/api', routes);

// Error handler (last middleware)
const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

module.exports = app;

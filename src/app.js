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

app.use(cors({                                    
        origin: 'https://bittu-cloud.netlify.app',
        credentials: true
}));
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

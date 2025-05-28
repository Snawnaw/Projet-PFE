const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();

// Rate limiter configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
});

// Middleware - correct order matters!
// Configure CORS with credentials first
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS for preflight
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Other middleware
app.use(limiter); // Apply rate limiting
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// Routes
// ...existing code...

// Routes
const auth = require('./routes/Auth.routes');
const section = require('./routes/Section.routes');
const filiere = require('./routes/Filiere.routes');
const Module = require('./routes/Module.routes');
const salle = require('./routes/Salle.routes');
const enseignant = require('./routes/Enseignant.routes');
const etudiant = require('./routes/Etudiant.routes');
const questionRoutes = require('./routes/QuestRep.routes'); 
const examRoutes = require('./routes/Exam.routes');


// Mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/section', section);
app.use('/api/v1/filiere', filiere);
app.use('/api/v1/module', Module);
app.use('/api/v1/salle', salle);
app.use('/api/v1/enseignant', enseignant);
app.use('/api/v1/etudiant', etudiant);
app.use('/api/v1/question', questionRoutes);
app.use('/api/v1/exam', examRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
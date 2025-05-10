const express = require('express');
const router = express.Router();
const {
    createQuestion,
    getQuestions,
    getQuestionsByModule
} = require('../controllers/CreerQuestionController');

// Create questions
router.post('/', createQuestion);

// Get all questions
router.get('/', getQuestions);

// Get questions by module
router.get('/module/:moduleId', getQuestionsByModule);

module.exports = router;
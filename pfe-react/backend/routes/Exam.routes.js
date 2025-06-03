const express = require('express');
const router = express.Router();
const ExamPDFController = require('../controllers/ExamPDFController');
const ExamWebController = require('../controllers/ExamWebController');

// Common routes
router.get('/', ExamPDFController.getAllExams);
router.post('/', ExamPDFController.createExam);
router.get('/:id', ExamPDFController.getExamById);
router.put('/:id', ExamPDFController.updateExam);
router.delete('/:id', ExamPDFController.deleteExam);

// PDF specific routes
router.get('/:id/answer-key', ExamPDFController.AnswerExamKey);

// Web specific routes
router.post('/generate-web-exam', ExamWebController.generateWebExam); // Specific endpoint for web exams
router.get('/:id/generate-link', ExamWebController.generateExamLink);
router.get('/:id/web-answer-key', ExamWebController.generateWebExamAnswerKey);
router.get('/public/:shareableId', ExamWebController.getPublicExam);
router.post('/submit/:shareableId', ExamWebController.submitExam);

module.exports = router;
const express = require('express');
const router = express.Router();
const SubmissionController = require('../controllers/SubmissionController');

// Route to submit answers for an exam
router.post('/submit/:shareableId', SubmissionController.submitExam);

// Route to fetch submissions for a specific exam
router.get('/:examId', SubmissionController.getSubmissionsByExamId);

// Route to fetch a specific submission by submission ID
router.get('/submission/:submissionId', SubmissionController.getSubmissionById);

// Route to fetch all submissions for a specific student
router.get('/student/:studentId', SubmissionController.getSubmissionsByStudentId);

module.exports = router;
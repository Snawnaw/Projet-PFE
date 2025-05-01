const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');

const {
    createExam
} = require('../controllers/ExamController');

router.post('ExamCreate', isAuthenticatedUser, authorizedRoles('admin'), createExam); // Only admin can create


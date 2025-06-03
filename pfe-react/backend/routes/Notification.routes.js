const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const router = express.Router();

router.post('/send-exam-link', NotificationController.sendExamLinkToStudents);

module.exports = router;
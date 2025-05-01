const CatchAsyncError = require('../middleware/catchAsyncError');
const Exam = require('../models/Exam');

exports.createExam = CatchAsyncError(async (req, res) => {
    try {
        const Exam = await Exam.create(req.body);
        res.status(201).json({
            success: true,
            exam: Exam,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating exam',
            error: error.message,
        });
    }
});

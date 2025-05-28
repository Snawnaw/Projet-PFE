const CatchAsyncError = require('../middleware/catchAsyncError');
const Submission = require('../models/Submission');
const Exam = require('../models/Exam');

const SubmissionController = {
    submitExam: CatchAsyncError(async (req, res) => {
        const { shareableId } = req.params;
        const { studentId, answers } = req.body;

        const exam = await Exam.findOne({ shareableId });
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        const submission = new Submission({
            examId: exam._id,
            studentId,
            answers,
            submittedAt: new Date()
        });

        await submission.save();

        res.status(201).json({
            success: true,
            message: 'Submission successful',
            submission
        });
    }),

    getSubmissionsByExam: CatchAsyncError(async (req, res) => {
        const { examId } = req.params;

        const submissions = await Submission.find({ examId })
            .populate('studentId', 'name email') // Assuming studentId references a User model
            .populate('examId', 'module examDate');

        res.status(200).json({
            success: true,
            submissions
        });
    }),

    getSubmissionById: CatchAsyncError(async (req, res) => {
        const { id } = req.params;

        const submission = await Submission.findById(id)
            .populate('studentId', 'name email')
            .populate('examId', 'module examDate');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.status(200).json({
            success: true,
            submission
        });
    }),

    calculateScore: CatchAsyncError(async (req, res) => {
        const { id } = req.params;

        const submission = await Submission.findById(id).populate('examId');
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        const correctAnswers = submission.examId.questions.map(question => {
            const correctOption = question.options.find(option => option.isCorrect);
            return correctOption ? correctOption.text : null;
        });

        const score = submission.answers.reduce((acc, answer, index) => {
            return acc + (answer === correctAnswers[index] ? 1 : 0);
        }, 0);

        res.status(200).json({
            success: true,
            score,
            totalQuestions: correctAnswers.length
        });
    })
};

module.exports = SubmissionController;
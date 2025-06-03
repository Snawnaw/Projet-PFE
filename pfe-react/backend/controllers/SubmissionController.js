const CatchAsyncError = require('../middleware/CatchAsyncError');
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

    getResultsByStudent: CatchAsyncError(async (req, res) => {
        const { studentId } = req.params;
        const submissions = await Submission.find({ student: studentId }).populate('examId');
        res.status(200).json({ success: true, submissions });
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
            const correctOption = question.options.filter(option => option.isCorrect).map(opt => opt.text);
            return { enonce: question.enonce, correct: correctOption };
        });

        const score = submission.answers.reduce((acc, answer, index) => {
            const correct = correctAnswers[index].correct;
            return acc + (Array.isArray(answer) && answer.every(a => correct.includes(a)) ? 1 : 0);
        }, 0);

        submission.score = score;
        await submission.save();

        res.status(200).json({
            success: true,
            score,
            totalQuestions: correctAnswers.length,
            answerKey: correctAnswers,
        });
    }),

    getSubmissionsWithAnswerKey: CatchAsyncError(async (req, res) => {
        const { examId } = req.params;

        const submissions = await Submission.find({ examId }).populate('studentId', 'name email');
        const exam = await Exam.findById(examId).populate('questions');

        if (!exam) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        const answerKey = exam.questions.map(question => ({
            enonce: question.enonce,
            correct: question.options.filter(option => option.isCorrect).map(opt => opt.text),
        }));

        res.status(200).json({
            success: true,
            submissions,
            answerKey,
        });
    }),
};

module.exports = SubmissionController;
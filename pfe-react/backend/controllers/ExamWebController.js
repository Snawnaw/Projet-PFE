const CatchAsyncError = require('../middleware/catchAsyncError');
const Filiere = require('../models/Filiere');
const Module = require('../models/Module');
const Section = require('../models/Section');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const { nanoid } = require('nanoid');
const { jsPDF } = require('jspdf');

const ExamWebController = {
getAllExams: CatchAsyncError(async (req, res) => {
    try {
        const exams = await Exam.find()
            .populate('module')
            .populate('filiere')
            .populate('section')
            .populate('enseignant')
            .populate('questions');

        res.status(200).json({
            success: true,
            exams: exams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching exams',
            error: error.message
        });
    }
}),

createExam : CatchAsyncError(async (req, res) => {
    try {
        const { module, filiere, section, enseignant, examType, difficulte, examDate, duree, format, questions } = req.body;

        // Check if the exam already exists
        const existingExam = await Exam.findOne({ module, examDate });
        if (existingExam) {
            return res.status(400).json({
                success: false,
                message: 'Exam already exists for this module and date'
            });
        }

        const exam = await Exam.create({
            module,
            filiere,
            section,
            enseignant,
            examType,
            difficulte,
            examDate,
            duree,
            format,
            questions
        });

        res.status(201).json({
            success: true,
            exam: {
                _id: exam._id,
                module: exam.module,
                filiere: exam.filiere,
                section: exam.section,
                enseignant: exam.enseignant,
                examType: exam.examType,
                difficulte: exam.difficulte,
                examDate: exam.examDate,
                duree: exam.duree,
                format: exam.format
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating the exam',
            error: error.message
        });
    }
}),

getExamById : CatchAsyncError(async (req, res) => {
    try {
        const examId = req.params.id;

        const exam = await Exam.findById(examId)
            .populate('section')
            .populate('enseignant')
            .populate('questions');

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            success: true,
            exam: exam
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching the exam',
            error: error.message
        });
    }
}),

updateExam : CatchAsyncError(async (req, res) => {
    try {
        const examId = req.params.id;
        const { module, filiere, section, enseignant, examType, difficulte, examDate, duree, format, questions } = req.body;

        const exam = await Exam.findByIdAndUpdate(
            examId,
            {
                module,
                filiere,
                section,
                enseignant,
                examType,
                difficulte,
                examDate,
                duree,
                format,
                questions
            },
            { new: true }
        );

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            success: true,
            exam: exam
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating the exam',
            error: error.message
        });
    }
}),

deleteExam : CatchAsyncError(async (req, res) => {
    try {
        const examId = req.params.id;

        const exam = await Exam.findByIdAndDelete(examId);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Exam deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting the exam',
            error: error.message
        });
    }
}),

generateWebExam: CatchAsyncError(async (req, res) => {
    try {
        const { module, filiere, section, enseignant, examType, difficulte, examDate, duree, questions } = req.body;

        // Check if the exam already exists
        const existingExam = await Exam.findOne({ module, examDate, format: 'WEB' });
        if (existingExam) {
            return res.status(400).json({
                success: false,
                message: 'A web-based exam already exists for this module and date'
            });
        }

        // Verify questions exist
        const questionDocs = await Question.find({ _id: { $in: questions } });
        if (questionDocs.length !== questions.length) {
            return res.status(400).json({
                success: false,
                message: 'Some questions were not found'
            });
        }

        // Create the web-based exam
        const exam = await Exam.create({
            module,
            filiere,
            section,
            enseignant,
            examType,
            difficulte,
            examDate,
            duree,
            format: 'WEB',
            questions,
            shareableId: nanoid(10)
        });

        // Populate the exam data before returning
        const populatedExam = await Exam.findById(exam._id)
            .populate('module')
            .populate('filiere')
            .populate('section')
            .populate('enseignant')
            .populate('questions');

        res.status(201).json({
            success: true,
            exam: populatedExam
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating the web-based exam',
            error: error.message
        });
    }
}),

generateExamLink: CatchAsyncError(async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the exam by ID
        const exam = await Exam.findById(id);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        if (exam.format !== 'WEB') {
            return res.status(400).json({
                success: false,
                message: 'This exam is not in WEB format'
            });
        }

        if (!exam.shareableId) {
            return res.status(400).json({
                success: false,
                message: 'Exam does not have a shareable ID'
            });
        }

        // Generate the link
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const examLink = `${baseUrl}/exam/${exam.shareableId}`;

        res.status(200).json({
            success: true,
            examLink: examLink
        });
    } catch (error) {
        console.error('Error generating exam link:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error generating the exam link',
            error: error.message
        });
    }
}),

generateWebExamAnswerKey : CatchAsyncError(async (req, res) => {
    try {
        const examId = req.params.id;

        // Fetch the exam details
        const exam = await Exam.findById(examId)
            .populate('questions', 'enonce options')
            .populate('module', 'nom')
            .populate('filiere', 'nom')
            .populate('section', 'nom')
            .populate('enseignant', 'nom prenom');

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        if (exam.format !== 'WEB') {
            return res.status(400).json({
                success: false,
                message: 'This exam is not in WEB format'
            });
        }

        // Create a new PDF document
        const doc = new jsPDF();

        // Add title and metadata
        doc.setFontSize(16);
        doc.text(`Answer Key: ${exam.module.nom}`, 20, 20);

        // Add exam metadata
        const examDate = new Date(exam.examDate).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        doc.setFontSize(12);
        doc.text(`Date: ${examDate}`, 20, 30);
        doc.text(`Filière: ${exam.filiere.nom}`, 20, 40);
        doc.text(`Section: ${exam.section.nom}`, 20, 50);
        doc.text(`Enseignant: ${exam.enseignant.nom} ${exam.enseignant.prenom}`, 20, 60);

        // Add questions and answers
        let yPosition = 70;
        exam.questions.forEach((question, index) => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            // Add question text
            doc.setFontSize(12);
            doc.text(`Q${index + 1}: ${question.enonce}`, 20, yPosition);
            yPosition += 10;

            // Add correct answer(s)
            const correctAnswers = question.options
                .filter(option => option.isCorrect)
                .map(option => option.text)
                .join(', ');

            doc.setFontSize(10);
            doc.text(`Answer: ${correctAnswers}`, 30, yPosition);
            yPosition += 10;
        });

        // Send the PDF as a response
        const pdfBuffer = doc.output('arraybuffer');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Answer_Key_${exam.module.nom}.pdf"`);
        res.send(Buffer.from(pdfBuffer));
    } catch (error) {
        console.error('Error generating answer key:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating answer key',
            error: error.message
        });
    }
}),

getPublicExam: CatchAsyncError(async (req, res) => {
    try {
        const { shareableId } = req.params;

        // Fetch the exam using the shareableId
        const exam = await Exam.findOne({ shareableId })
            .populate('module')
            .populate('filiere')
            .populate('section')
            .populate('enseignant')
            .populate('questions.options');

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            success: true,
            exam
        });
    } catch (error) {
        console.error('Error fetching exam:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exam',
            error: error.message
        });
    }
}),

submitExam : CatchAsyncError(async (req, res) => {
    try {
        const { shareableId } = req.params;
        const { answers } = req.body;

        // Find the exam by shareableId
        const exam = await Exam.findOne({ shareableId }).populate('questions', 'options');

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        // Validate answers
        let score = 0;
        exam.questions.forEach((question) => {
            const correctOption = question.options.find((opt) => opt.isCorrect);
            if (correctOption && answers[question._id] === correctOption._id.toString()) {
                score += 1;
            }
        });

        res.status(200).json({
            success: true,
            message: 'Exam submitted successfully',
            score,
            totalQuestions: exam.questions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting the exam',
            error: error.message
        });
    }
}),
};

module.exports = ExamWebController;
const CatchAsyncError = require('../middleware/catchAsyncError');
const Filiere = require('../models/Filiere');
const Module = require('../models/Module');
const Section = require('../models/Section');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const { jsPDF } = require('jspdf');

const ExamPDFController = {
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

createExam: CatchAsyncError(async (req, res) => {
    try {
        console.log('Received exam data:', req.body); // Debug log
        
        const { module, filiere, section, enseignant, examType, difficulte, examDate, duree, format, questions } = req.body;

        // Validate required fields
        if (!module || !filiere || !section || !enseignant || !examType || !difficulte || !examDate || !duree || !format) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Check if the exam already exists
        const existingExam = await Exam.findOne({ module, examDate });
        if (existingExam) {
            return res.status(400).json({
                success: false,
                message: 'Exam already exists for this module and date'
            });
        }

        // Validate questions exist if provided
        if (questions && questions.length > 0) {
            const existingQuestions = await Question.countDocuments({ _id: { $in: questions } });
            if (existingQuestions !== questions.length) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more questions do not exist'
                });
            }
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
            questions: questions || [] // Ensure questions is always an array
        });

        // Populate the exam data before returning
        const populatedExam = await Exam.findById(exam._id)
            .populate('module', 'nom')
            .populate('filiere', 'nom')
            .populate('section', 'nom')
            .populate('enseignant', 'nom prenom')
            .populate('questions');

        res.status(201).json({
            success: true,
            exam: populatedExam
        });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating the exam',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}),

getExamById : CatchAsyncError(async (req, res) => {
    try {
        const examId = req.params.id;

        const exam = await Exam.findById(examId)
            .populate('section')
            .populate('filiere')
            .populate('module')
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

AnswerExamKey : CatchAsyncError(async (req, res) => {
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
}

module.exports = ExamPDFController;

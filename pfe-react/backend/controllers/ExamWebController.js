const CatchAsyncError = require('../middleware/catchAsyncError');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const { nanoid } = require('nanoid');
const { jsPDF } = require('jspdf');

const ExamWebController = {
  getAllExams: CatchAsyncError(async (req, res) => {
    const exams = await Exam.find()
      .populate('module')
      .populate('filiere')
      .populate('section')
      .populate('enseignant')
      .populate('questions');

    res.status(200).json({
      success: true,
      exams
    });
  }),

  createExam: CatchAsyncError(async (req, res) => {
    const { module, filiere, section, enseignant, examType, difficulte, examDate, duree, format, questions } = req.body;

    // Check if the exam already exists
    const existingExam = await Exam.findOne({ module, examDate });
    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: 'Exam already exists for this module and date'
      });
    }

    // Validate questions exist
    const questionCount = await Question.countDocuments({ _id: { $in: questions } });
    if (questionCount !== questions.length) {
      return res.status(400).json({
        success: false,
        message: 'Some questions were not found'
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
  }),

  getExamById: CatchAsyncError(async (req, res) => {
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
      exam
    });
  }),

  updateExam: CatchAsyncError(async (req, res) => {
    const examId = req.params.id;
    const { module, filiere, section, enseignant, examType, difficulte, examDate, duree, format, questions } = req.body;

    // Validate questions exist if they're being updated
    if (questions) {
      const questionCount = await Question.countDocuments({ _id: { $in: questions } });
      if (questionCount !== questions.length) {
        return res.status(400).json({
          success: false,
          message: 'Some questions were not found'
        });
      }
    }

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
      exam
    });
  }),

  deleteExam: CatchAsyncError(async (req, res) => {
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
  }),

  generateWebExam: CatchAsyncError(async (req, res) => {
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
    const questionCount = await Question.countDocuments({ _id: { $in: questions } });
    if (questionCount !== questions.length) {
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
  }),

  generateExamLink: CatchAsyncError(async (req, res) => {
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
      exam.shareableId = nanoid(10);
      await exam.save();
    }

    // Generate the link
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const examLink = `${baseUrl}/exam/${exam.shareableId}`;

    res.status(200).json({
      success: true,
      examLink
    });
  }),

  generateWebExamAnswerKey: CatchAsyncError(async (req, res) => {
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
  }),

  getPublicExam: CatchAsyncError(async (req, res) => {
    const { shareableId } = req.params;

    // Fetch the exam using the shareableId
    const exam = await Exam.findOne({ shareableId })
      .populate('module')
      .populate('filiere')
      .populate('section')
      .populate('enseignant')
      .populate({
        path: 'questions',
        populate: {
          path: 'options'
        }
      });

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
  }),

  submitExam: CatchAsyncError(async (req, res) => {
    const { shareableId } = req.params;
    const { answers } = req.body;

    // Find the exam by shareableId
    const exam = await Exam.findOne({ shareableId }).populate({
      path: 'questions',
      select: 'options',
      populate: {
        path: 'options',
        select: 'isCorrect _id'
      }
    });

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
      totalQuestions: exam.questions.length,
      percentage: Math.round((score / exam.questions.length) * 100)
    });
  })
};

module.exports = ExamWebController;
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const Schema = mongoose.Schema;

const ExamSchema = new mongoose.Schema({
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    filiere: { type: mongoose.Schema.Types.ObjectId, ref: 'Filiere', required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    enseignant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant', required: true },
    examType: { type: String, required: true },
    difficulte: { type: String, required: true },
    examDate: { type: Date, required: true },
    duree: { type: Number, required: true },
    format: { type: String, required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    shareableId: {
      type: String,
      unique: true,
      sparse: true // <-- add this!
    } // <-- retirer unique/sparse ici
});

// Add pre-save middleware to handle shareableId
ExamSchema.pre('save', async function(next) {
    if (this.format === 'WEB' && !this.shareableId) {
        this.shareableId = nanoid(10);
    }
    // Correction: remove shareableId for non-WEB exams
    if (this.format !== 'WEB') {
        this.shareableId = undefined;
        delete this.shareableId; // <-- This line ensures the field is not saved at all
    }
    next();
});

// Correction: gardez uniquement CETTE ligne pour l'index
ExamSchema.index({ shareableId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Exam', ExamSchema);
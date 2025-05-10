// models/Question.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    enonce: {
        type: String,
        required: [true, "Veuillez saisir l'enoncé de la question"],
        maxlength: [500, "L'enoncé de la question ne doit pas dépasser 500 caractères"],
    },
    difficulte: {
        type: String,
        enum: ["Facile", "Moyen", "Difficile"],
        required: [true, "Veuillez saisir la difficulté de la question"],
    },
    type: {
        type: String,
        enum: ["QCM", "QCU", "TEXT"],
        required: [true, "Veuillez saisir le type de la question"],
    },
    module: {
        type: Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    correctAnswer: {
        type: String,
        required: function() {
            return this.type === 'TEXT';
        }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', questionSchema);
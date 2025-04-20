const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
    filiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filiere',
        required: true,
    },

    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
    },

    typeExam: {
        type: String,
        required: true,
        enum: ['Examen Final ', 'Controle Continu', 'TP'],
    },

    difficulte: {
        type: String,
        required: true,
        enum: ['Facile', 'Moyen', 'Difficile'],
    },

    nombreQuestions: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
    },

    date: {
        type: Date,
        required: true,
    },

    durée: {
        type: Number,
        required: true,
        min: 1,
    },

    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
    },

});
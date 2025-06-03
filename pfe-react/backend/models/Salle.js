// Dans models/Salle.js
const mongoose = require('mongoose');

const salleSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: [true, 'Le numéro de salle est requis'],
        unique: true,
        trim: true
    },
    nom: {
        type: String,
        required: [true, 'Le nom de salle est requis'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Le type de salle est requis'],
        enum: {
            values: ['Salle de cours', 'Laboratoire', 'Amphithéâtre', 'Salle TD', 'Salle TP'],
            message: 'Type de salle invalide'
        }
    },
    capacite: {
        type: Number,
        required: [true, 'La capacité est requise'],
        min: [1, 'La capacité doit être au moins 1'],
        max: [500, 'La capacité ne peut pas dépasser 500']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Salle', salleSchema);
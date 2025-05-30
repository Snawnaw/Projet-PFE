const { cpSync } = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
    nom: {
        type: String,
        required: [true, "Veuillez saisir le nom de la section"],
        MaxLenght: [15, "Le nom de la section ne doit pas depasser 15 caracteres"],
    },

    filiere: {
        type: Schema.Types.ObjectId,
        ref: "Filiere",
        required: [true, "Veuillez saisir la filiere de la section"],
    },

    niveau: {
        type: String,
        required: [true, "Veuillez saisir le niveau de la section"],
    },

    enseignant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enseignant',
        required: [true, "Veuillez saisir l'enseignant de la section"],
    },

    nombre_etudiants: {
        type: Number,
        required: [true, "Veuillez saisir le nombre d'étudiants de la section"],
    },

    nombre_groupes: {
        type: Number,
        required: [true, "Veuillez saisir le nombre de groupes de la section"],
    },
    enseignant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' }
});

module.exports = mongoose.model('Section', SectionSchema);
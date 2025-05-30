const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
    nom: {
        type: String,
        required: [true, "Veuillez saisir le nom du module"],
        maxLength: [50, "Le nom du module ne doit pas depasser 50 caracteres"],
    },

    code: {
        type: String,
        required: [true, "Veuillez saisir le code du module"],
        maxlength: 5,
    },

    filiere: {
        type: Schema.Types.ObjectId,
        ref: 'Filiere',
        required: [true, "Veuillez saisir la filiere du module"],
    },

    section: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        required: [true, "Veuillez saisir la section du module"],
        maxLength: [50, "La section du module ne doit pas depasser 50 caracteres"],
    },

    enseignant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enseignant',
    },

    type: {
        type: String,
        required: [true, "Veuillez saisir le type du module"],
        enum: ["semestriel", "trimestriel", "annuel"],
    },
});

module.exports = mongoose.model('Module', ModuleSchema);
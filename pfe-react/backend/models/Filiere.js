const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FiliereSchema = new Schema({
    nom: {
        type: String,
        required: [true, "Veuillez saisir le nom de la filiere"],
        maxLength: [50, "Le nom de la filiere ne doit pas depasser 50 caracteres"],
    },

    code: {
        type: String,
        required: [true, "Veuillez saisir le code de la filiere"],
        unique: true,
        maxLength: [5, "Le code de la filiere ne doit pas depasser  caracteres"],
    },


    cycle: {
        type: String,
        required: [true, "Veuillez saisir le cycle d'etude"],
        enum: ["Licence", "Master"],
    },
    
    enseignant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' }
});

module.exports = mongoose.model('Filiere', FiliereSchema);
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
        maxLength: [5, "Le code de la filiere ne doit pas depasser 5 caracteres"],
    },


    cycle: {
        type: String,
        required: [true, "Veuillez saisir le cycle d'etude"],
        enum: ["Licence", "Master"],
    },

    niveau: {
        type: String,
        required: [false, "Veuillez saisir le niveau d'etude"],
        enum: ["L1", "L2", "L3", "M1", "M2"],
    },
    
    //enseignant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant', required: false },
});

module.exports = mongoose.model('Filiere', FiliereSchema);
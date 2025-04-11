const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
    nom: {
        type: String,
        required: [true, "Veuillez saisir le nom de la section"],
        MaxLenght: [15, "Le nom de la section ne doit pas depasser 15 caracteres"],
    },

    filiere: {
        type: String,
        required: [true, "Veuillez saisir la filiere de la section"],
    },

    niveau: {
        type: String,
        required: [true, "Veuillez saisir le niveau de la section"],
    },

    nomber_de_groupes: {
        type: Number,
        required: [true, "Veuillez saisir le nombre de groupes de la section"],
    },
});

module.exports = mongoose.model("Section", SectionSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalleSchema = new Schema({
    numero:{
        type: Number,
        required: [true, "Veuillez saisir le numero de la salle"],
        unique: true,
        MaxLenght: [3, "Le numero de la salle ne doit pas depasser 3 caracteres"],
    },

    nom: {
        type: String,
        required: [true, "Veuillez saisir le nom de la salle"],
        MaxLenght: [15, "Le nom de la salle ne doit pas depasser 15 caracteres"],
    },

    capacite: {
        type: Number,
        required: [true, "Veuillez saisir la capacite de la salle"],
    },

    type: {
        type: String,
        enum: ["cours", "td", "tp", "amphi"],
        required: [true, "Veuillez saisir le type de la salle"],
    }
});

module.exports = mongoose.model("Salle", SalleSchema);
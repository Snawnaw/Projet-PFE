import { type } from "os";

const SalleSchema = new Schema({
    nom: {
        type: String,
        required: [true, "Veuillez saisir le nom de la salle"],
        MaxLenght: [15, "Le nom de la salle ne doit pas depasser 15 caracteres"],
    },

    code: {
        type: String,
        required: [true, "Veuillez saisir le code de la salle"],
        unique: true,
        MaxLenght: [5, "Le code de la salle ne doit pas depasser 5 caracteres"],
    },

    capacite: {
        type: Number,
        required: [true, "Veuillez saisir la capacite de la salle"],
    },

    type: {
        type: String,
        enum: ["cours", "td", "tp", "amphi"],
        required: [true, "Veuillez saisir le type de la salle"],
    },

    departement: {
        type: String,
        required: [true, "Veuillez saisir le departement de la salle"],
    },
});
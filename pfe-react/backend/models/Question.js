
const questionSchema = new Schema({

    id: {
        type: String,
        unique: true,
        MaxLenght: [3, "L'id de la question ne doit pas depasser 3 caracteres"],
    },

    enoncé: {
        type: String,
        required: [true, "Veuillez saisir l'enoncé de la question"],
        MaxLenght: [200, "L'enoncé de la question ne doit pas dépasser 200 caracteres"],
    },

    difficulte: {
        type: String,
        enum: ["facile", "moyen", "difficile"],
        required: [true, "Veuillez saisir la difficulte de la question"],
    },

    type: {
        type: String,
        enum: ["QCM", "QCU"],
        required: [true, "Veuillez saisir le type de la question"],
    },



});
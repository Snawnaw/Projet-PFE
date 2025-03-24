const FiliereSchema = new Schema({
    nom: {
        type: String,
        required: [true, "Veuillez saisir le nom de la filiere"],
        MaxLenght: [50, "Le nom de la filiere ne doit pas depasser 50 caracteres"],
    },

    code: {
        type: String,
        required: [true, "Veuillez saisir le code de la filiere"],
        unique: true,
        MaxLenght: [5, "Le code de la filiere ne doit pas depasser  caracteres"],
    },


    CreatedAt: {
        type: Date,
        default: Date.now,
    },
});
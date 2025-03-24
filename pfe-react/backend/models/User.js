const userSchema = new Schema({
    nom: {
        type: String,
        required: [true, "Veuillez saisir votre nom"],
        MaxLenght: [25, "Le nom ne doit pas depasser 25 caracteres"],
    },

    prenom: {
        type: String,
        required: [true, "Veuillez saisir votre prenom"],
        MaxLenght: [30, "Le prenom ne doit pas depasser 30 caracteres"],
    },

    dateNaissance: {
        type: Date,
        required: [true, "Veuillez saisir votre date de naissance"],
    },

    numeroTel: {
        type: String,
        required: [true, "Veuillez saisir votre numero de telephone"],
        unique: true,
        match: [
            /^0[5-7][0-9]{8}$/,
            'Veuillez saisir un numero de telephone valide'
        ]
    },

    email: {
        type: String,
        required: [true, "Veuillez saisir votre email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Veuillez saisir un email valide'
        ]
    },

    password: {
        type: String,
        required: [true, "Veuillez saisir votre mot de passe"],
        MinLenght: [9, "Le mot de passe doit contenir au moins 9 caracteres"],
        select: false,
    },

    CreatedAt: {
        type: Date,
        default: Date.now,
    },
});

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Veuillez saisir votre nom"],
        maxLength: [25, "Le nom ne doit pas dépasser 25 caractères"],
    },
    prenom: {
        type: String,
        required: [true, "Veuillez saisir votre prénom"],
        maxLength: [30, "Le prénom ne doit pas dépasser 30 caractères"],
    },
    date_naissance: {
        type: Date,
        required: [true, "Veuillez saisir votre date de naissance"],
    },
    numero_tel: {
        type: String,
        required: [true, "Veuillez saisir votre numéro de téléphone"],
        unique: true,
        match: [
            /^0[5-7][0-9]{8}$/,
            'Veuillez saisir un numéro de téléphone valide'
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
        minLength: [9, "Le mot de passe doit contenir au moins 9 caractères"],
        select: false,
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'enseignant', 'etudiant'],
            message: 'Veuillez choisir un rôle valide : admin ou enseignant'
        },
        default: 'enseignant',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token method
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

module.exports = mongoose.model("User", userSchema);

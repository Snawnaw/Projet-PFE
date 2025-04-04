const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Veuillez saisir votre nom"],
        maxLength: [25, "Le nom ne doit pas depasser 25 caracteres"],
    },

    prenom: {
        type: String,
        required: [true, "Veuillez saisir votre prenom"],
        maxLength: [30, "Le prenom ne doit pas depasser 30 caracteres"],
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
        minLength: [9, "Le mot de passe doit contenir au moins 9 caracteres"],
        select: false,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Password encryption before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    
    this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

module.exports = mongoose.model("User", userSchema);
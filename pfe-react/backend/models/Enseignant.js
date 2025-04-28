const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const enseignantSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Veuillez entrer le nom"],
        trim: true,
        maxLength: [50, "Le nom ne peut pas dépasser 50 caractères"]
    },
    prenom: {
        type: String,
        required: [true, "Veuillez entrer le prénom"],
        trim: true,
        maxLength: [50, "Le prénom ne peut pas dépasser 50 caractères"]
    },
    dateNaissance: {
        type: Date,
        required: [true, "Veuillez saisir la date de naissance"]
    },
    numeroTel: {
        type: String,
        required: [true, "Veuillez saisir le numéro de téléphone"],
        unique: true,
        match: [/^0[5-7][0-9]{8}$/, 'Veuillez saisir un numéro valide']
    },
    email: {
        type: String,
        required: [true, "Veuillez entrer l'email"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Veuillez entrer le mot de passe"],
        minLength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
        select: false
    },
    role: {
        type: String,
        default: 'enseignant'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password before saving
enseignantSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
enseignantSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
enseignantSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
};

module.exports = mongoose.model('Enseignant', enseignantSchema);
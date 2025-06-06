const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const etudiantSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Veuillez saisir le nom']
    },
    prenom: {
        type: String,
        required: [true, 'Veuillez saisir le prénom']
    },
    date_naissance: {
        type: Date,
        required: [true, 'Veuillez saisir la date de naissance']
    },
    numero_tel: {
        type: String,
        required: [true, 'Veuillez saisir le numéro de téléphone'],
        unique: true
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
        default: 'etudiant',
    },
    filiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filiere',
        required: [true, "Veuillez entrer la filière"]
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: [true, "Veuillez entrer la section"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password before saving
etudiantSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
etudiantSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
etudiantSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
};

module.exports = mongoose.model('etudiant', etudiantSchema);
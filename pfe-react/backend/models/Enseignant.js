const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const enseignantSchema = new mongoose.Schema({
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
        default: 'enseignant'
    },
    filieres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filiere',
        required: [true, "Veuillez entrer au moins une filière"]
    }],

    modules: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Module' 
    }],

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
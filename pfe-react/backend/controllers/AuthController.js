const CatchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = CatchAsyncError(async (req, res, next) => {
    const { nom, prenom, date_naissance, numero_tel, email, password, role } = req.body;

    // Créer l'utilisateur avec le rôle fourni
    const user = await User.create({
        nom,
        prenom,
        date_naissance,
        numero_tel,
        email,
        password,
        role // 'admin' ou 'enseignant' selon req.body
    });

    if (user.role === 'enseignant') {
        const Enseignant = require('../models/Enseignant');
        const enseignant = new Enseignant({
            nom,
            prenom,
            date_naissance,
            numero_tel,
            email: user.email,
            password: user.password, // already hashed
            role: 'enseignant',
            createdAt: new Date()
        });
        await enseignant.save();
    }

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        token,
        user: {
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            numero_tel: user.numero_tel,
            date_naissance: user.date_naissance,
            role: user.role, // bien renvoyer le rôle ici
            createdAt: user.createdAt
        }
    });
});

// Login user
exports.loginUser = CatchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: "Veuillez saisir l'email et le mot de passe" 
        });
    }

    const user = await User.findOne({ email: email }).select("+password");

    // Add debug log
    console.log('Login attempt:', { email, password, userFound: !!user, userPassword: user?.password });

    if (!user) {
        return res.status(401).json({ message: 'Identifiants invalides' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d"
    });

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    };
    
    res.status(200)
        .cookie("token", token, cookieOptions)
        .json({
            success: true,
            token,
            user: {
                _id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                numero_tel: user.numero_tel,
                date_naissance: user.date_naissance,
                role: user.role,
                createdAt: user.createdAt
            }
        });
});

exports.logout = CatchAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out'
    });
});

exports.getUserProfile = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

exports.updateUserProfile = CatchAsyncError(async (req, res, next) => {
    const { nom, prenom, date_naissance, numero_tel, email } = req.body;

    // Vérification de l'utilisateur connecté
    const user = await User.findById(req.user.id);
    
    if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Mise à jour des champs
    user.nom = nom ?? user.nom;
    user.prenom = prenom ?? user.prenom;
    user.date_naissance = date_naissance ?? user.date_naissance;
    user.numero_tel = numero_tel ?? user.numero_tel;
    user.email = email ?? user.email;

    await user.save();

    res.status(200).json({
        success: true,
        user
    });
}
);

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
        role // 'admin' ou 'user' selon req.body
    });

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

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({ 
            success: false,
            message: "Email ou mot de passe incorrect" 
        });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatched) {
        return res.status(401).json({ 
            success: false,
            message: "Email ou mot de passe incorrect" 
        });
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

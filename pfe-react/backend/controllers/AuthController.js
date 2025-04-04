const CatchAsyncError = require("../middleware/CatchAsyncError");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register a new user
exports.registerUser = CatchAsyncError(async (req, res, next) => {
    const { nom, prenom, dateNaissance, numeroTel, email, password } = req.body;
    
    const user = await User.create({
        nom,
        prenom,
        dateNaissance,
        numeroTel,
        email,
        password,
    });

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        token,
        user
    });
});

// Login user
exports.loginUser = CatchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are entered
    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: "Veuillez saisir l'email et le mot de passe" 
        });
    }

    // Find user in database
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
        return res.status(401).json({ 
            success: false,
            message: "Email ou mot de passe incorrect" 
        });
    }

    // Check if password is correct
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatched) {
        return res.status(401).json({ 
            success: false,
            message: "Email ou mot de passe incorrect" 
        });
    }

    const token = user.getJWTToken();
    
    res.status(200).json({
        success: true,
        token,
        user
    });
});
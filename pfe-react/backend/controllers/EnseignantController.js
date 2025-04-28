const Enseignant = require('../models/Enseignant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all teachers
exports.getAllEnseignants = async (req, res) => {
    try {
        const enseignants = await Enseignant.find();
        res.status(200).json(enseignants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get teacher by ID 
exports.getEnseignantById = async (req, res) => {
    try {
        const enseignant = await Enseignant.findById(req.params.id);
        if (!enseignant) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json(enseignant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new teacher
exports.createEnseignant = async (req, res) => {
    try {
        const { 
            nom, 
            prenom, 
            dateNaissance, 
            numeroTel, 
            email, 
            password, 
            role 
        } = req.body;

        // Check if teacher already exists
        const existingEmail = await Enseignant.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Cet email existe déjà" });
        }

        const existingPhone = await Enseignant.findOne({ numeroTel });
        if (existingPhone) {
            return res.status(400).json({ message: "Ce numéro de téléphone existe déjà" });
        }

        // Hash password
        //const hashedPassword = await bcrypt.hash(password, 10);

        const enseignant = new Enseignant({
            nom,
            prenom,
            dateNaissance,
            numeroTel,
            email,
            password,
            role
        });

        const savedEnseignant = await enseignant.save();
        res.status(201).json(savedEnseignant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update teacher
exports.updateEnseignant = async (req, res) => {
    try {
        const { 
            nom, 
            prenom, 
            dateNaissance, 
            numeroTel, 
            email, 
            role 
    } = req.body;

        // Check if new email already exists
        if (email) {
            const existingEmail = await Enseignant.findOne({ 
                email, 
                _id: { $ne: req.params.id } 
            });
            if (existingEmail) {
                return res.status(400).json({ message: "Cet email existe déjà" });
            }
        }

        // Check if new phone number already exists
        if (numeroTel) {
            const existingPhone = await Enseignant.findOne({ 
                numeroTel, 
                _id: { $ne: req.params.id } 
            });
            if (existingPhone) {
                return res.status(400).json({ message: "Ce numéro de téléphone existe déjà" });
            }
        }

        const updatedEnseignant = await Enseignant.findByIdAndUpdate(
            req.params.id,
            { nom, prenom, dateNaissance, numeroTel, email, role },
            { new: true, runValidators: true }
        );
        
        if (!updatedEnseignant) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }
        res.status(200).json(updatedEnseignant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete teacher
exports.deleteEnseignant = async (req, res) => {
    try {
        const deletedEnseignant = await Enseignant.findByIdAndDelete(req.params.id);
        if (!deletedEnseignant) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }
        res.status(200).json({ message: "Enseignant supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Teacher login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if teacher exists
        const enseignant = await Enseignant.findOne({ email }).select('+password');
        if (!enseignant) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, enseignant.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: enseignant._id, email: enseignant.email, role: enseignant.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            enseignant: {
                id: enseignant._id,
                nom: enseignant.nom,
                prenom: enseignant.prenom,
                dateNaissance: enseignant.dateNaissance,
                numeroTel: enseignant.numeroTel,
                email: enseignant.email,
                role: enseignant.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
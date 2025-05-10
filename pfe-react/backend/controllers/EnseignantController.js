const Enseignant = require('../models/Enseignant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { create } = require('../models/Filiere');

// Get all teachers
exports.getAllEnseignants = async (req, res) => {
    try {
        const enseignants = await Enseignant.find();
        res.status(200).json({
            success: true,
            enseignants
        });
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

exports.getEnseignantsByFiliere = async (req, res) => {
    try {
        const { filiereID } = req.params;
        const enseignants = await Enseignant.find({ filiere: filiereID }); // Filtrer par filière
        res.status(200).json({
            success: true,
            enseignants,
        });
    } catch (error) {
        console.error('Error fetching enseignants:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Create new teacher
exports.createEnseignant = async (req, res) => {
    try {
        const { 
            nom, 
            prenom, 
            date_naissance, // Correspondance avec le frontend
            numero_tel,     // Correspondance avec le frontend
            email, 
            password, 
            role,
            module, // Optional: if you want to set the module field
            createdAt // Optional: if you want to set the createdAt field
        } = req.body;


        // Check if teacher already exists
        const existingEnseignant = await Enseignant.findOne({ nom, prenom });
        if (existingEnseignant) {
            return res.status(400).json({ message: "Cet enseignant existe déjà" });
        }

        const existingEmail = await Enseignant.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Cet email existe déjà" });
        }

        if (!req.body.numero_tel) {
            return res.status(400).json({ message: 'Le champ numero de telephone est requis.' });
          }

        if (!date_naissance) {
            return res.status(400).json({ message: 'Veuillez choisir une date de naissance.' });
        }

        const existingPhone = await Enseignant.findOne({ numero_tel });
        if (existingPhone) {
            return res.status(400).json({ message: 'Ce numéro de téléphone existe déjà.' });
        }

        // Hash password
        //const hashedPassword = await bcrypt.hash(password, 10);

        const enseignant = new Enseignant({
            nom,
            prenom,
            date_naissance,
            numero_tel,
            email,
            password,
            role,
            module,
            createdAt: new Date() // Set createdAt to current date
        });

        await enseignant.save();
        res.status(201).json({ message: "Enseignant créé avec succès" });
    } catch (error) {
        console.error('Erreur lors de la création de l\'enseignant :', error);
        res.status(500).json({ message: error.message });
    }
};

// Update teacher
exports.updateEnseignant = async (req, res) => {
    try {
        const { 
            nom, 
            prenom, 
            date_naissance, 
            numero_tel, 
            email,
            password, // Optional: if you want to update the password 
            role,
            module, // Optional: if you want to update the module field
            createdAt // Optional: if you want to update the createdAt field
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
        if (numero_tel) {
            const existingPhone = await Enseignant.findOne({ 
                numero_tel, 
                _id: { $ne: req.params.id } 
            });
            if (existingPhone) {
                return res.status(400).json({ message: "Ce numéro de téléphone existe déjà" });
            }
        }

        const updatedEnseignant = await Enseignant.findByIdAndUpdate(
            req.params.id,
            { nom, prenom, date_naissance, numero_tel, email, role, module, password, createdAt },
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
                date_naissance: enseignant.date_naissance,
                numero_tel: enseignant.numero_tel,
                email: enseignant.email,
                role: enseignant.role,
                module: enseignant.module,
                createdAt: enseignant.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
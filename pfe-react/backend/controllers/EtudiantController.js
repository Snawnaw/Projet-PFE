const Etudiant = require('../models/Etudiant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { create } = require('../models/Section');

// Get all teachers
exports.getAllEtudiants = async (req, res) => {
    try {
        const etudiants = await Etudiant.find();
        res.status(200).json({
            success: true,
            etudiants
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get teacher by ID 
exports.getEtudiantById = async (req, res) => {
    try {
        const etudiant = await Etudiant.findById(req.params.id);
        if (!etudiant) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json(etudiant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEtudiantsBySection = async (req, res) => {
    try {
        const { sectionID } = req.params;
        const etudiants = await Etudiant.find({ section: sectionID }); // Filtrer par filière
        res.status(200).json({
            success: true,
            etudiants,
        });
    } catch (error) {
        console.error('Error fetching etudiants:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Create new teacher
exports.createEtudiant = async (req, res) => {
    try {
        const { 
            nom, 
            prenom, 
            date_naissance, // Correspondance avec le frontend
            numero_tel,     // Correspondance avec le frontend
            email, 
            password, 
            role = 'etudiant'
            //module, // Optional: if you want to set the module field
            //createdAt // Optional: if you want to set the createdAt field
        } = req.body;


        // Check if teacher already exists
        const existingEtudiant = await Etudiant.findOne({ nom, prenom });
        if (existingEtudiant) {
            return res.status(400).json({ message: "Cet etudiant existe déjà" });
        }

        const existingEmail = await Etudiant.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Cet email existe déjà" });
        }

        if (!req.body.numero_tel) {
            return res.status(400).json({ message: 'Le champ numero de telephone est requis.' });
          }

        if (!date_naissance) {
            return res.status(400).json({ message: 'Veuillez choisir une date de naissance.' });
        }

        const existingPhone = await Etudiant.findOne({ numero_tel });
        if (existingPhone) {
            return res.status(400).json({ message: 'Ce numéro de téléphone existe déjà.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const etudiant = new Etudiant({
            nom,
            prenom,
            date_naissance,
            numero_tel,
            email,
            password: hashedPassword,
            role,
            //module,
            createdAt: new Date() // Set createdAt to current date
        });

        const user = new User({
            nom: nom + ' ' + prenom,
            email,
            password: hashedPassword,
            dateNaissance: date_naissance,
            role: 'etudiant'
        });

        await etudiant.save();
        await user.save();

        res.status(201).json({ message: "Etudiant créé avec succès" });
    } catch (error) {
        console.error('Erreur lors de la création de l\'etudiant :', error);
        res.status(500).json({ message: error.message });
    }
};

// Update teacher
exports.updateEtudiant = async (req, res) => {
    try {
        const { 
            nom, 
            prenom, 
            date_naissance, 
            numero_tel, 
            email,
            password, // Optional: if you want to update the password 
            role,
            //module, // Optional: if you want to update the module field
            //createdAt // Optional: if you want to update the createdAt field
    } = req.body;

        // Check if new email already exists
        if (email) {
            const existingEmail = await Etudiant.findOne({ 
                email, 
                _id: { $ne: req.params.id } 
            });
            if (existingEmail) {
                return res.status(400).json({ message: "Cet email existe déjà" });
            }
        }

        // Check if new phone number already exists
        if (numero_tel) {
            const existingPhone = await Etudiant.findOne({ 
                numero_tel, 
                _id: { $ne: req.params.id } 
            });
            if (existingPhone) {
                return res.status(400).json({ message: "Ce numéro de téléphone existe déjà" });
            }
        }

        const updatedEtudiant = await Etudiant.findByIdAndUpdate(
            req.params.id,
            { nom, prenom, date_naissance, numero_tel, email, role, module, password, createdAt },
            { new: true, runValidators: true }
        );
        
        if (!updatedEtudiant) {
            return res.status(404).json({ message: "Etudiant non trouvé" });
        }
        res.status(200).json(updatedEtudiant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete teacher
exports.deleteEtudiant = async (req, res) => {
    try {
        const deletedEtudiant = await Etudiant.findByIdAndDelete(req.params.id);
        if (!deletedEtudiant) {
            return res.status(404).json({ message: "Etudiant non trouvé" });
        }
        res.status(200).json({ message: "Etudiant supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Teacher login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if teacher exists
        const etudiant = await Etudiant.findOne({ email }).select('+password');
        if (!etudiant) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, etudiant.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: etudiant._id, email: etudiant.email, role: etudiant.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            etudiant: {
                id: etudiant._id,
                nom: etudiant.nom,
                prenom: etudiant.prenom,
                date_naissance: etudiant.date_naissance,
                numero_tel: etudiant.numero_tel,
                email: etudiant.email,
                role: etudiant.role,
                module: etudiant.module,
                createdAt: etudiant.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
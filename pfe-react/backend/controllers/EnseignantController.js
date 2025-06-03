const Enseignant = require('../models/Enseignant');
const User = require('../models/User');
const Filiere = require('../models/Filiere');
const Section = require('../models/Section');
const Module = require('../models/Module');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { create } = require('../models/Filiere');

// Get all teachers
exports.getAllEnseignants = async (req, res) => {
    try {
        const enseignants = await Enseignant.find()
            .populate('modules') // <-- populate modules
            .populate('filieres'); // <-- populate filiere
        res.status(200).json({
            success: true,
            enseignants: enseignants.map(enseignant => ({
                _id: enseignant._id,
                nom: enseignant.nom,
                prenom: enseignant.prenom,
                email: enseignant.email,
                numero_tel: enseignant.numero_tel,
                date_naissance: enseignant.date_naissance,
                filieres: enseignant.filieres?.map(f => f.nom).join(', ') || 'N/A', // AJOUTER
                modules: enseignant.modules?.map(m => m.nom).join(', ') || 'N/A',   // AJOUTER
                role: enseignant.role,
                createdAt: enseignant.createdAt
            }))
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

exports.getEnseignantByEmail = async (req, res) => {
    try {
        const enseignant = await Enseignant.findOne({ email: req.params.email })
            .populate('modules'); // <-- IMPORTANT

        if (!enseignant) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }

        res.status(200).json({ enseignant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEnseignantsByFiliere = async (req, res) => {
    try {
        const { filiereID } = req.params;
        const enseignants = await Enseignant.find({ filieres: filiereID }); // Filtrer par filière
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
            date_naissance,
            numero_tel,
            email, 
            password, 
            role = 'enseignant',
            filieres,
            modules
        } = req.body;

        // Validation: check required fields
        if (!nom || !prenom || !date_naissance || !numero_tel || !email || !password || !filieres) {
            return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
        }

        // Check if enseignant already exists
        const existingEnseignant = await Enseignant.findOne({ email });
        if (existingEnseignant) {
            return res.status(400).json({ message: "Cet email existe déjà" });
        }

        const existingPhone = await Enseignant.findOne({ numero_tel });
        if (existingPhone) {
            return res.status(400).json({ message: 'Ce numéro de téléphone existe déjà.' });
        }

        // Hash password for Enseignant only
        const hashedPassword = await bcrypt.hash(password, 10);

        const enseignant = new Enseignant({
            nom,
            prenom,
            date_naissance,
            numero_tel,
            email,
            password: hashedPassword,
            role,
            filieres,
            modules: modules || [],
            createdAt: new Date()
        });

        await enseignant.save();

        // Pass plain password to User, let Mongoose hash it
        await User.create({
            nom,
            prenom,
            date_naissance,
            numero_tel,
            email,
            password, // <-- plain password, NOT hashedPassword
            role: 'enseignant'
        });

        res.status(201).json({ message: "Enseignant créé avec succès" });
    } catch (error) {
        console.error('Erreur lors de la création de l\'enseignant :', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
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
            password, // Optional
            role,
            module,
            createdAt
        } = req.body;

        // Fetch the current enseignant
        const existingEnseignant = await Enseignant.findById(req.params.id);
        if (!existingEnseignant) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }

        // Check if new email already exists (for another enseignant)
        if (email && email !== existingEnseignant.email) {
            const existingEmail = await Enseignant.findOne({ 
                email, 
                _id: { $ne: req.params.id } 
            });
            if (existingEmail) {
                return res.status(400).json({ message: "Cet email existe déjà" });
            }
        }

        // Check if new phone number already exists (for another enseignant)
        if (numero_tel && numero_tel !== existingEnseignant.numero_tel) {
            const existingPhone = await Enseignant.findOne({ 
                numero_tel, 
                _id: { $ne: req.params.id } 
            });
            if (existingPhone) {
                return res.status(400).json({ message: "Ce numéro de téléphone existe déjà" });
            }
        }

        // Optionally hash password if changed
        let updatedPassword = existingEnseignant.password;
        if (password && password !== existingEnseignant.password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        const updatedEnseignant = await Enseignant.findByIdAndUpdate(
            req.params.id,
            { nom, prenom, date_naissance, numero_tel, email, role, module, password: updatedPassword, createdAt },
            { new: true, runValidators: true }
        );

        await User.findOneAndUpdate(
            { email: existingEnseignant.email }, // or { _id: req.params.id }
            { nom, prenom, date_naissance, numero_tel, email }
        );
        
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

getSubmissionsWithAnswerKey: CatchAsyncError(async (req, res) => {
    const { examId } = req.params;

    const submissions = await Submission.find({ examId }).populate('studentId', 'name email');
    const exam = await Exam.findById(examId).populate('questions');

    if (!exam) {
        return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const answerKey = exam.questions.map(question => ({
        enonce: question.enonce,
        correct: question.options.filter(option => option.isCorrect).map(opt => opt.text),
    }));

    res.status(200).json({
        success: true,
        submissions,
        answerKey,
    });
});
const CatchAsyncError = require('../middleware/CatchAsyncError');
const Module = require('../models/Module');

exports.getAllModules = CatchAsyncError(async (req, res) => {
    try {
        const modules = await Module.find()
            .populate('filiere')
            .populate('section')
            .populate('enseignant');
            
        res.status(200).json({
            success: true,
            modules
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching modules',
            error: error.message
        });
    }
});

exports.createModule = CatchAsyncError(async (req, res, next) => {
    try {
        const { 
            nom, 
            code, 
            filiere, 
            section, 
            enseignant, 
            type 
        } = req.body;

        // Check if module with same code already exists
        const existingModule = await Module.findOne({ code });
        if (existingModule) {
            return res.status(400).json({
                success: false,
                message: `Module with code ${code} already exists`
            });
        }

        const module = await Module.create({
            nom,
            code,
            filiere,
            section,
            enseignant,
            type
        });

        res.status(201).json({
            success: true,
            module
        });
    } catch (error) {
        // Handle MongoDB errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Module code must be unique'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating module',
            error: error.message
        });
    }
});

exports.getModulesByFiliere = async (req, res) => {
    try {
        const filiereId = req.params.filiereId;
        const modules = await Module.find({ filiere: filiereId });
        res.status(200).json({ modules });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Exemple pour les modules
exports.getModulesByEnseignant = async (req, res) => {
    const modules = await Module.find({ enseignant: req.params.enseignantId });
    res.json({ modules });
};

exports.deleteModule = async (req, res) => {
    try {
        const module = await Module.findByIdAndDelete(req.params.id);
        if (!module) {
            return res.status(404).json({ success: false, message: 'Module not found' });
        }
        res.status(200).json({ success: true, message: 'Module deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateModule = async (req, res) => {
    try {
        const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!module) {
            return res.status(404).json({ success: false, message: 'Module not found' });
        }
        res.status(200).json({ success: true, module });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

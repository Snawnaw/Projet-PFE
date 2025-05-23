const CatchAsyncError = require('../middleware/catchAsyncError');
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

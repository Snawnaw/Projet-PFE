const CatchAsyncError = require('../middleware/CatchAsyncError');
const Filiere = require('../models/Filiere');

exports.createFiliere = CatchAsyncError(async (req, res, next) => {
    const { nom, code, cycle } = req.body;

    // Check if filiere with same code already exists
    const existingFiliere = await Filiere.findOne({ code });
    if (existingFiliere) {
        return res.status(400).json({
            success: false,
            message: `Filiere with code ${code} already exists`
        });
    }

    try {
        const filiere = await Filiere.create({
            nom,
            code,
            cycle
        });

        res.status(201).json({
            success: true,
            filiere: {
                _id: filiere._id,
                nom: filiere.nom,
                code: filiere.code,
                cycle: filiere.cycle,
                createdAt: filiere.createdAt
            }
        });
    } catch (error) {
        // Handle MongoDB errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Filiere code must be unique'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Error creating filiere',
            error: error.message
        });
    }
});

// Get all filieres
exports.getAllFilieres = CatchAsyncError(async (req, res) => {
    const filieres = await Filiere.find();
    
    res.status(200).json({
        success: true,
        count: filieres.length,
        filieres
    });
});

// Update a filiere
exports.updateFiliere = CatchAsyncError(async (req, res) => {
    const { nom, code, cycle } = req.body;

    try {
        const filiere = await Filiere.findByIdAndUpdate(
            req.params.id, 
            { nom, code, cycle },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!filiere) {
            return res.status(404).json({
                success: false,
                message: 'Filiere not found'
            });
        }

        res.status(200).json({
            success: true,
            filiere
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Filiere code must be unique'
            });
        }

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Delete a filiere
exports.deleteFiliere = CatchAsyncError(async (req, res) => {
    const filiere = await Filiere.findByIdAndDelete(req.params.id);

    if (!filiere) {
        return res.status(404).json({
            success: false,
            message: 'Filiere not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Filiere deleted successfully'
    });
});
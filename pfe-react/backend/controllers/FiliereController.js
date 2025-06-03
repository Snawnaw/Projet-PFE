const CatchAsyncError = require('../middleware/CatchAsyncError');
const Filiere = require('../models/Filiere');
const Enseignant = require('../models/Enseignant');

// Get all filieres
exports.getAllFilieres = CatchAsyncError(async (req, res) => {
    try{
        const filieres = await Filiere.find();
        res.status(200).json({
            success: true,
            filieres: filieres // Make sure we explicitly include the filieres array
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching filieres',
            error: error.message
        });
    }
    
});

exports.createFiliere = CatchAsyncError(async (req, res, next) => {
    try {
        const { nom, code, cycle, niveau } = req.body;

        // Check if filiere with same code already exists
        const existingFiliere = await Filiere.findOne({ code });
        if (existingFiliere) {
            return res.status(400).json({
                success: false,
                message: `Filiere with code ${code} already exists`
            });
        }

    
        const filiere = await Filiere.create({
            nom,
            code,
            cycle,
            niveau: niveau || null, 
        });

        res.status(201).json({
            success: true,
            filiere: {
                _id: filiere._id,
                nom: filiere.nom,
                code: filiere.code,
                cycle: filiere.cycle,
                niveau: filiere.niveau,
                //createdAt: filiere.createdAt
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

// Update a filiere
exports.updateFiliere = CatchAsyncError(async (req, res) => {
    const { nom, code, cycle, niveau } = req.body;

    try {
        const filiere = await Filiere.findByIdAndUpdate(
            req.params.id, 
            { nom, code, cycle, niveau },
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

// Pour les filières de l'enseignant
exports.getFilieresByEnseignant = async (req, res) => {
    const enseignant = await Enseignant.findById(req.params.enseignantId).populate('filieres');
    res.json({ filieres: enseignant.filieres });
};
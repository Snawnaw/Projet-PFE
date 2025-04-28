const Section = require('../models/Section');
const CatchAsyncError = require('../middleware/CatchAsyncError');

// Get all sections
exports.getAllSections = CatchAsyncError(async (req, res) => {
    try {
        const sections = await Section.find();
        res.status(200).json({
            success: true,
            count: sections.length,
            sections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create new section
exports.createSection = async (req, res) => {
    try {
        const { nom, filiere, niveau, nomber_de_groupes } = req.body;
        
        // Check if section already exists
        const existingSection = await Section.findOne({ nom });
        if (existingSection) {
            return res.status(400).json({
                success: false,
                message: 'Section already exists'
            });
        }

        const section = await Section.create({
            nom,
            filiere,
            niveau,
            nombre_de_groupes
        });

        res.status(201).json({
            success: true,
            section
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update section
exports.updateSection = async (req, res) => {
    try {
        let section = await Section.findById(req.params.id);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found'
            });
        }

        section = await Section.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            section
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete section
exports.deleteSection = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found'
            });
        }

        await section.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Section deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = exports;
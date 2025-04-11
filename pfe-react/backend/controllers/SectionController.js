const Section = require('../models/Section');
const CatchAsyncError = require('../middleware/CatchAsyncError');

// Get all sections
exports.getAllSections = CatchAsyncError(async (req, res) => {
    const sections = await Section.find();
    
    res.status(200).json({
        success: true,
        count: sections.length,
        sections
    });
});

// Create new section
exports.createSection = CatchAsyncError(async (req, res) => {
    const { nom, filiere, niveau, nomber_de_groupes } = req.body;

    const section = await Section.create({
        nom,
        filiere,
        niveau,
        nomber_de_groupes
    });

    res.status(201).json({
        success: true,
        section
    });
});

// Update section
exports.updateSection = CatchAsyncError(async (req, res) => {
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
});

// Delete section
exports.deleteSection = CatchAsyncError(async (req, res) => {
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
});
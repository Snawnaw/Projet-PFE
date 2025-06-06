const Section = require('../models/Section');
const Enseignant = require('../models/Enseignant');
const catchAsyncError = require('../middleware/CatchAsyncError');

// Get all sections
exports.getAllSections = catchAsyncError(async (req, res) => {
    try {
        const { filiereID } = req.params;
        const sections = await Section.find().populate('filiere');
        res.status(200).json({
            success: true,
            sections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

exports.getSectionsByFiliere = async (req, res) => {
    try {
        const { filiereId } = req.params;
        const sections = await Section.find({ filiere: filiereId });
        res.status(200).json({ sections });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des sections" });
    }
};

// Create new section
exports.createSection = async (req, res) => {
    try {
        const { nom, filiere, niveau, nombre_etudiants, nombre_groupes } = req.body;
        
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
            nombre_etudiants,
            nombre_groupes
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

// Pour les sections de l'enseignant
exports.getSectionsByEnseignant = async (req, res) => {
  try {
    const enseignantId = req.params.enseignantId;
    
    // Approche 1: Récupérer les sections depuis les modules de l'enseignant
    const enseignant = await Enseignant.findById(enseignantId);
    
    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }
    
    // Récupérer toutes les sections liées aux modules de l'enseignant
    const moduleIds = enseignant.modules || [];
    
    // Rechercher les sections qui appartiennent à ces modules
    const sections = await Section.find().populate('filiere');
    
    // Renvoyer les sections
    return res.status(200).json({ 
      success: true,
      sections: sections 
    });
    
  } catch (error) {
    console.error("Erreur dans getSectionsByEnseignant:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.getSectionById = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id).populate('filiere');
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }
        res.status(200).json({ section });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = exports;
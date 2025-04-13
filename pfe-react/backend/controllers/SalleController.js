const CatchAsyncError = require('../middleware/CatchAsyncError');
const Salle = require('../models/Salle');

// Get all salles
exports.getAllSalles = CatchAsyncError(async (req, res) => {
    const salles = await Salle.find({});
    if (!salles || salles.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Aucune salle trouvée',
        });
    }

    res.status(200).json({
        success: true,
        salles,
    });
});

// Get one salle
exports.getSalle = CatchAsyncError(async (req, res) => {
    const salle = await Salle.findById(req.params.id);
    if (!salle) {
        return res.status(404).json({
            success: false,
            message: 'Salle not found',
        });
    }

    res.status(200).json({
        success: true,
        salle,
    });
});

// Create salle
exports.createSalle = CatchAsyncError(async (req, res) => {
    const { numero, nom, capacite, type, departement } = req.body;

    const isSalleExist = await Salle.findOne({ numero });
    if (isSalleExist) {
        return res.status(400).json({
            success: false,
            message: 'Salle already exists',
        });
    }

    const newSalle = await Salle.create({
        numero,
        nom,
        capacite,
        type,
        departement,
    });

    res.status(201).json({
        success: true,
        salle: newSalle,
    });
});

// Update salle
exports.updateSalle = CatchAsyncError(async (req, res) => {
    const { numero, nom, capacite, type, departement } = req.body;

    let salle = await Salle.findById(req.params.id);

    if (!salle) {
        return res.status(404).json({
            success: false,
            message: 'Salle not found',
        });
    }

    salle.numero = numero;
    salle.nom = nom;
    salle.capacite = capacite;
    salle.type = type;
    salle.departement = departement;

    await salle.save();

    res.status(200).json({
        success: true,
        message: 'Salle updated successfully',
        salle,
    });
});

// Delete salle
exports.deleteSalle = CatchAsyncError(async (req, res) => {
    const salle = await Salle.findByIdAndDelete(req.params.id);

    if (!salle) {
        return res.status(404).json({
            success: false,
            message: 'Salle not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Salle deleted successfully',
    });
});

const CatchAsyncError = require('../middleware/CatchAsyncError');
const Salle = require('../models/Salle');

// Get all salles
exports.getAllSalles = CatchAsyncError(async (req, res) => {
    try {
        const salles = await Salle.find();
        res.status(200).json({
            success: true,
            count: salles.length,
            salles
        });
    } catch (error) {
        // Fixed catch block
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create salle
exports.createSalle = CatchAsyncError(async (req, res) => {
    const { numero, nom, capacite, type, departement } = req.body;

    const isSalleExist = await Salle.findOne({ numero });
    if (isSalleExist) {
        return res.status(400).json({
            success: false,
            message: 'Une salle avec ce numéro existe déjà'
        });
    }

    const salle = await Salle.create({
        numero,
        nom,
        capacite,
        type,
        departement
    });

    res.status(201).json({
        success: true,
        message: 'Salle créée avec succès',
        salle
    });
});

// Update salle
exports.updateSalle = CatchAsyncError(async (req, res) => {
    const { numero, nom, capacite, type, departement } = req.body;

    const salle = await Salle.findById(req.params.id);
    if (!salle) {
        return res.status(404).json({
            success: false,
            message: 'Salle non trouvée'
        });
    }

    const duplicateSalle = await Salle.findOne({ 
        numero, 
        _id: { $ne: req.params.id } 
    });
    if (duplicateSalle) {
        return res.status(400).json({
            success: false,
            message: 'Une salle avec ce numéro existe déjà'
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
        message: 'Salle mise à jour avec succès',
        salle
    });
});

// Delete salle
exports.deleteSalle = CatchAsyncError(async (req, res) => {
    const salle = await Salle.findById(req.params.id);
    if (!salle) {
        return res.status(404).json({
            success: false,
            message: 'Salle non trouvée'
        });
    }

    await salle.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Salle supprimée avec succès'
    });
});
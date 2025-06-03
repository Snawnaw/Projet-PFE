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
    const { 
        numero, 
        nom, 
        capacite, 
        type 
    } = req.body;

    console.log('Données reçues:', { numero, nom, type, capacite });

    // Vérifier si une salle avec le même numéro existe déjà
        const existingSalle = await Salle.findOne({ numero });
        if (existingSalle) {
            return res.status(400).json({
                success: false,
                message: `Une salle avec le numéro ${numero} existe déjà`
            });
        }

    // Validation des champs requis
        if (!numero || !nom || !type || !capacite) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont requis (numero, nom, type, capacite)'
            });
        }

    const salle = await Salle.create({
        numero,
        nom,
        capacite: parseInt(capacite),
        type
    });

    res.status(201).json({
        success: true,
        message: 'Salle créée avec succès',
        salle: {
                _id: salle._id,
                numero: salle.numero,
                nom: salle.nom,
                type: salle.type,
                capacite: salle.capacite
        }
    });
});

// Update salle
exports.updateSalle = CatchAsyncError(async (req, res) => {
    const { numero, nom, capacite, type } = req.body;

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
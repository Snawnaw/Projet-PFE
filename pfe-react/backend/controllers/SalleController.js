const Salle = require('../models/Salle');

exports.createSalle = async (req, res) => {
    const { numero, nom, capacite, type, departement } = req.body;

    const isSalleExist = await Salle.findOne({ numero });
    if (isSalleExist) {
        return res.status(400).json({
            success: false,
            message: 'Salle already exists',
        });
    }

    const Salle = await Salle.create({
        numero,
        nom,
        capacite,
        type,
        departement,
    });

    const token = Salle.getJWTToken();

    res.status(201).json({
        success: true,
        token,
        Salle,
    });

    //find les salles in database
    const salles = await Salle.find({});
    if (!salles) {
        return res.status(401).json({
            success: false,
            message: 'Aucune salle trouvée',
        });
    }

    res.status(200).json({
        success: true,
        salles,
    });

    
}

exports.getAllSalle = async (req, res) => {
    const salles = await Salle.find({});
    if (!salles) {
        return res.status(401).json({
            success: false,
            message: 'Aucune salle trouvée',
        });
    }

    res.status(200).json({
        success: true,
        salles,
    });
}

exports.updateSalle = async (req, res) => {
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
}

exports.deleteSalle = async (req, res) => {
    const salle = await Salle.findById(req.params.id);

    if (!salle) {
        return res.status(404).json({
            success: false,
            message: 'Salle not found',
        });
    }

    await salle.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Salle deleted successfully',
    });
}


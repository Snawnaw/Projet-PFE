const Salle = require('../models/Salle');

exports.createSalle = async (req, res) => {
    const { numero, nom, capacite, type, departement } = req.body;

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
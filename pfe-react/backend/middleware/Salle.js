const jwt = require('jsonwebtoken');
const Salle = require('../models/Salle');

module.exports = async (req, res, next) => { // req : request, res : response, next : next middleware
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Veuillez vous connecter pour accéder à cette ressource'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const salle = await Salle.findById(decoded.id);

        if (!salle) {
            return res.status(401).json({
                success: false,
                message: 'Token invalid'
            });
        }

        req.salle = salle;
        next();

    }catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Non autorisé. Veuillez vous connecter'
        });
    }
}
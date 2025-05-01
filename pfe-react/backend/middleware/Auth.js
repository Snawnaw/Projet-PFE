const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncError');
/* 
exports.isAuth = async (req, res, next) => { // req : request, res : response, next : next middleware
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Veuillez vous connecter pour accéder à cette ressource'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user with the id from token
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token invalid'
            });
        }

        // Add user to request
        req.user = user;
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Non autorisé. Veuillez vous connecter'
        });
    }
};
*/
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    
    if(!token) {
        return next(new ErrorHandler('Login to access this resource', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});

exports.authorizedRoles = (...roles) => {
    return (req , res, next ) => {
        if(!roles.includes(req.user.role)){
            return next (
                new ErrorHandler(`Role (${req.user.role}) is not allowed`,403)
            );
        }
        next();
    };
};

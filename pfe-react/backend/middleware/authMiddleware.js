const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncError');

// Authentication middleware
const protect = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    
    if(!token) {
        return next(new ErrorHandler('Login to access this resource', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});

// Authorization middleware
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed`, 403)
            );
        }
        next();
    };
};

// Export the middleware functions
module.exports = {
    protect,
    restrictTo
};
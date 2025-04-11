const express = require('express');
const router = express.Router();

const { 
    registerUser, 
    loginUser , 
    logout , 
    getUserProfile 
} = require('../controllers/AuthController');

const {isAuthenticatedUser} = require('../middleware/Auth');

// No need to import isAuth for these public routes
/* 
router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser);   
    // Login user
*/
//Correct Ones :: 

// root is : un resultat de show, elle affiche le resultat de la methode

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/me').get(isAuthenticatedUser , getUserProfile);


module.exports = router;
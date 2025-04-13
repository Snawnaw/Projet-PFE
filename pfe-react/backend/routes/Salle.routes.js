const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');

// Import the controller (you'll need to create this too)
const { 
    getAllSalles,
    createSalle,
    updateSalle,
    deleteSalle
} = require('../controllers/SalleController');

// Define routes
router.route('AllSalle/').get(getAllSalles);
router.route('SalleCreate/').post(isAuthenticatedUser, authorizedRoles('admin'), createSalle);
router.route('SalleEdit/:id').put(isAuthenticatedUser, authorizedRoles('admin'), updateSalle);
router.route('SalleDelete/:id').delete(isAuthenticatedUser, authorizedRoles('admin'), deleteSalle);

module.exports = router;
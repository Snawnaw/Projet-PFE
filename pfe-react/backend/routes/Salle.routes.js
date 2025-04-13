const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');

const { 
    getAllSalles,  // Make sure this matches the exported function name
    createSalle,
    updateSalle,
    deleteSalle
} = require('../controllers/SalleController');

// Fix the route handlers
router.route('/AllSalle').get(isAuthenticatedUser, getAllSalles);
router.route('/SalleCreate').post(isAuthenticatedUser, authorizedRoles('admin'), createSalle);
router.route('/SalleEdit/:id').put(isAuthenticatedUser, authorizedRoles('admin'), updateSalle);
router.route('/SalleDelete/:id').delete(isAuthenticatedUser, authorizedRoles('admin'), deleteSalle);

module.exports = router;
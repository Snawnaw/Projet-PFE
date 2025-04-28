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
router.get('/AllSalle', isAuthenticatedUser, getAllSalles);
router.post('/SalleCreate', isAuthenticatedUser, authorizedRoles('admin'), createSalle);
router.put('/SalleEdit/:id', isAuthenticatedUser, authorizedRoles('admin'), updateSalle);
router.delete('/SalleDelete/:id', isAuthenticatedUser, authorizedRoles('admin'), deleteSalle);

module.exports = router;
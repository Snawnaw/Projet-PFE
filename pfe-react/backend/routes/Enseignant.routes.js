const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');

const { 
    getAllEnseignants,
    getEnseignantsByFiliere, // Assuming this function is defined in your controller 
    createEnseignant,         
    updateEnseignant, 
    deleteEnseignant 
} = require('../controllers/EnseignantController');

router.get('/AllEnseignant', isAuthenticatedUser, getAllEnseignants); // Allow all authenticated users to read
router.get('/AllEnseignantByFiliere/:filiereID', isAuthenticatedUser, getEnseignantsByFiliere); // Allow all authenticated users to read by filiere ID
router.post('/EnseignantCreate', isAuthenticatedUser, authorizedRoles('admin'), createEnseignant); // Only admin can create
router.put('/EnseignantEdit', isAuthenticatedUser, authorizedRoles('admin'), updateEnseignant); // Missing :id parameter
router.delete('/EnseignantDelete', isAuthenticatedUser, authorizedRoles('admin'), deleteEnseignant); // Missing :id parameter

module.exports = router;
const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');

const { 
    getAllEnseignants, 
    createEnseignant,         
    updateEnseignant, 
    deleteEnseignant 
} = require('../controllers/EnseignantController');

router.get('/AllEnseignant', isAuthenticatedUser, getAllEnseignants); // Allow all authenticated users to read
router.post('/EnseignantCreate', isAuthenticatedUser, authorizedRoles('admin'), createEnseignant); // Only admin can create
router.put('/EnseignantEdit', isAuthenticatedUser, authorizedRoles('admin'), updateEnseignant); // Missing :id parameter
router.delete('/EnseignantDelete', isAuthenticatedUser, authorizedRoles('admin'), deleteEnseignant); // Missing :id parameter

module.exports = router;
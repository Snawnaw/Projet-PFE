const express = require('express');
const router = express.Router();

const { 
    getAllFilieres,
    getFilieresByEnseignant, 
    createFiliere,         
    updateFiliere, 
    deleteFiliere 
} = require('../controllers/FiliereController');

const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');

router.get('/AllFiliere', isAuthenticatedUser, getAllFilieres); // Allow all authenticated users to read
router.get('/FiliereByEnseignant/:enseignantId', isAuthenticatedUser, getFilieresByEnseignant); // Allow all authenticated users to read by enseignant ID
router.post('/FiliereCreate', isAuthenticatedUser, authorizedRoles('admin'), createFiliere); // Only admin can create
router.put('/:id', isAuthenticatedUser, authorizedRoles('admin'), updateFiliere); // Only admin can update
router.delete('/:id', isAuthenticatedUser, authorizedRoles('admin'), deleteFiliere); // Only admin can delete

module.exports = router;

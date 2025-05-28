const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');

const { 
    getAllEtudiants,
    getEtudiantsBySection, // Assuming this function is defined in your controller
    createEtudiant,
    updateEtudiant,          
    deleteEtudiant 
} = require('../controllers/EtudiantController');

router.get('/AllEtudiant', isAuthenticatedUser, getAllEtudiants); // Allow all authenticated users to read
router.get('/AllEtudiantBySection/:sectionID', isAuthenticatedUser, getEtudiantsBySection); // Allow all authenticated users to read by section ID
router.post('/EtudiantCreate', isAuthenticatedUser, authorizedRoles('admin'), createEtudiant); // Only admin can create
router.put('/EtudiantEdit/:id', isAuthenticatedUser, authorizedRoles('admin'), updateEtudiant); // Allow admin to update by ID
router.delete('/EtudiantDelete/:id', isAuthenticatedUser, authorizedRoles('admin'), deleteEtudiant); // Allow admin to delete by ID

module.exports = router;
const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');
const EnseignantController = require('../controllers/EnseignantController');
const { getSubmissionsWithAnswerKey } = require('../controllers/SubmissionController'); // <-- Fix import

const { 
    getAllEnseignants,
    getEnseignantsByFiliere,
    getEnseignantByEmail,
    createEnseignant,         
    updateEnseignant, 
    deleteEnseignant,
} = require('../controllers/EnseignantController');

router.get('/AllEnseignant', isAuthenticatedUser, getAllEnseignants); // Allow all authenticated users to read
router.get('/AllEnseignantByFiliere/:filiereID', isAuthenticatedUser, getEnseignantsByFiliere); // Allow all authenticated users to read by filiere ID
router.get('/byEmail/:email', isAuthenticatedUser, getEnseignantByEmail);
router.post('/EnseignantCreate', isAuthenticatedUser, authorizedRoles('admin'), createEnseignant); // Only admin can create
router.put('/:id', isAuthenticatedUser, authorizedRoles('admin', 'enseignant'), updateEnseignant); // Missing :id parameter
router.delete('/:id', isAuthenticatedUser, authorizedRoles('admin'), deleteEnseignant); // Missing :id parameter
router.get('/exam/:examId/submissions', isAuthenticatedUser, getSubmissionsWithAnswerKey); // <-- Ensure callback function is defined

module.exports = router;
const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');

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
router.put('/EnseignantEdit/:id', isAuthenticatedUser, authorizedRoles('admin', 'enseignant'), updateEnseignant); // Missing :id parameter
router.delete('/EnseignantDelete', isAuthenticatedUser, authorizedRoles('admin'), deleteEnseignant); // Missing :id parameter
router.get('/exam/:examId/submissions', SubmissionController.getSubmissionsWithAnswerKey);

module.exports = router;
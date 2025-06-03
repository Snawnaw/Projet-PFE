const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');
const {
    getAllModules,
    createModule,
    getModulesByFiliere,
    getModulesByEnseignant,
    deleteModule,
    updateModule
} = require('../controllers/ModuleController');

// Routes for modules
router.get('/AllModules', isAuthenticatedUser, getAllModules);
router.post('/ModuleCreate', isAuthenticatedUser, authorizedRoles('admin'), createModule); // Only admin can create
router.get('/ByFiliere/:filiereId', isAuthenticatedUser, getModulesByFiliere);
router.get('/ByEnseignant/:enseignantId', isAuthenticatedUser, getModulesByEnseignant);
router.put('/:id', isAuthenticatedUser, authorizedRoles('admin'), updateModule); // Only admin can update
router.delete('/:id', isAuthenticatedUser, authorizedRoles('admin'), deleteModule); // Only admin can delete

module.exports = router;


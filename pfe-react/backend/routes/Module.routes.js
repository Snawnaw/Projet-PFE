const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');

const { 
    getAllModules,
    createModule,
    getModulesByFiliere,
    /*updateModule,
    deleteModule,*/
} = require('../controllers/ModuleController');

// Routes for modules
router.get('/AllModules', isAuthenticatedUser, getAllModules);
router.post('/ModuleCreate', isAuthenticatedUser, authorizedRoles('admin'), createModule); // Only admin can create
router.get('/ModulesByFiliere/:filiereId', isAuthenticatedUser, getModulesByFiliere);
/*router.put('/ModuleEdit', isAuthenticatedUser, authorizedRoles('admin'), updateModule); // Only admin can update
router.delete('/ModuleDelete', isAuthenticatedUser, authorizedRoles('admin'), deleteModule); // Only admin can delete*/

module.exports = router;


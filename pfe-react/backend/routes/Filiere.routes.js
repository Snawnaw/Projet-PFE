const express = require('express');
const router = express.Router();

const { 
    getAllFilieres, 
    createFiliere,         
    updateFiliere, 
    deleteFiliere 
} = require('../controllers/FiliereController');

const { isAuthenticatedUser, authorizedRoles } = require('../middleware/Auth');

router.get('/AllFiliere', isAuthenticatedUser, getAllFilieres); // Allow all authenticated users to read
router.post('/FiliereCreate', isAuthenticatedUser, authorizedRoles('admin'), createFiliere); // Only admin can create
router.put('/FiliereEdit', isAuthenticatedUser, authorizedRoles('admin'), updateFiliere); // Only admin can update
router.delete('/FiliereDelete', isAuthenticatedUser, authorizedRoles('admin'), deleteFiliere); // Only admin can delete

module.exports = router;

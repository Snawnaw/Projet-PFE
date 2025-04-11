const express = require('express');
const router = express.Router();
const { getAllSalle, createSalle, updateSalle, deleteSalle } = require('../controllers/SalleController');
const isAuth = require('../middleware/Auth'); // Import the authentication middleware

router.get('/AllSalles', isAuthenticatedUser, getAllSalle); // Get all salles
router.post('/SalleCreate', isAuthenticatedUser, authorizedRoles("admin"), createSalle); // Create a new salle
router.put('/SalleEdit', isAuthenticatedUser, authorizedRoles("admin"), updateSalle); // Update a salle by ID
router.delete('/SalleDelete', isAuthenticatedUser, authorizedRoles("admin"), deleteSalle); // Delete a salle by ID

module.exports = router;
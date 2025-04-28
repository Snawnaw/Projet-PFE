const express = require('express');
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require('../middleware/Auth');

const { 
    getAllSections, 
    createSection, 
    updateSection, 
    deleteSection 
} = require('../controllers/SectionController');


router.get('/AllSections', isAuthenticatedUser, getAllSections); // Get all sections
router.post('/SectionCreate', isAuthenticatedUser, authorizedRoles("admin"), createSection); // Create a new section
router.put('/SectionEdit/:id', isAuthenticatedUser, authorizedRoles("admin"), updateSection); // Update a section by ID
router.delete('/SectionDelete/:id', isAuthenticatedUser, authorizedRoles("admin"), deleteSection); // Delete a section by ID

module.exports = router;
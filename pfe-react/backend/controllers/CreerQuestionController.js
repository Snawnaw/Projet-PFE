const Question = require('../models/Question');
const Module = require('../models/Module');
const mongoose = require('mongoose');

// In CreerQuestionController.js
exports.createQuestion = async (req, res) => {
    try {
        const { questions } = req.body;
        
        if (!questions || !Array.isArray(questions)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid questions data'
            });
        }

        // Validate all module IDs first
        const moduleIds = questions.map(q => q.module);
        
        try {
            const validModules = await Module.find({ 
                _id: { $in: moduleIds } 
            }).select('_id'); // Only select ID for validation
            
            if (validModules.length !== new Set(moduleIds).size) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more module IDs are invalid'
                });
            }
        } catch (err) {
            console.error('Module validation error:', err);
            return res.status(400).json({
                success: false,
                message: 'Invalid module reference'
            });
        }

        // Additional question validation
        const validationErrors = [];
        questions.forEach((q, index) => {
            if (q.type !== 'TEXT' && (!q.options || q.options.length < 2)) {
                validationErrors.push(`Question ${index + 1}: Non-TEXT questions must have at least 2 options`);
            }
            if (q.type === 'TEXT' && !q.correctAnswer) {
                validationErrors.push(`Question ${index + 1}: TEXT questions require a correctAnswer`);
            }
        });

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: validationErrors
            });
        }

        // Add createdBy if available
        const questionsToSave = questions.map(q => ({
            ...q,
            createdBy: req.user?._id || null
        }));

        // Save questions
        const savedQuestions = await Question.insertMany(questionsToSave);

        res.status(201).json({
            success: true,
            questions: savedQuestions
        });
    } catch (error) {
        console.error('Error creating questions:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating questions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// In CreerQuestionController.js
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .populate({
                path: 'module',
                select: 'nom',
                model: 'Module' // Explicitly specify the model
            });
        
        res.status(200).json({
            success: true,
            questions: questions.map(q => ({
                ...q._doc,
                module: q.module || { nom: 'N/A' } // Ensure module exists
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getQuestionsByModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { 
            limit = 10, 
            difficulte, 
        } = req.query;

        // Support both 'difficulte' and 'difficulte' for flexibility
        const diff = difficulte || difficulte;

        // Validate moduleId
        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid module ID'
            });
        }

        // Build query
        const query = { 
            module: new mongoose.Types.ObjectId(moduleId) // Updated this line
        };

        // Add difficulte filter if provided
        if (diff) {
            // Capitalize first letter to match model's enum
            query.difficulte = diff.charAt(0).toUpperCase() + diff.slice(1);
        }

        // Use aggregation for random sampling
        const questions = await Question.aggregate([
            { $match: query },
            { $sample: { size: parseInt(limit) } }
        ]);

        res.status(200).json({
            success: true,
            questions: questions.map(q => ({
                _id: q._id,
                text: q.enonce,
                options: q.options.map(opt => opt.text)
            })),
            count: questions.length
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching questions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
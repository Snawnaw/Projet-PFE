const Question = require('../models/Question');

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
        const validModules = await Module.find({ 
            _id: { $in: moduleIds } 
        });

        if (validModules.length !== new Set(moduleIds).size) {
            return res.status(400).json({
                success: false,
                message: 'One or more module IDs are invalid'
            });
        }

        // Save questions
        const savedQuestions = await Question.insertMany(questions);

        res.status(201).json({
            success: true,
            questions: savedQuestions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
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
        const questions = await Question.find({ module: req.params.moduleId })
            .populate('module', 'nom code');

        res.status(200).json({
            success: true,
            questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


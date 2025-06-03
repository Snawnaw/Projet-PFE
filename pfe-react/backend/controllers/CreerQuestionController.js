const Question = require('../models/Question');
const Module = require('../models/Module');
const mongoose = require('mongoose');

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
            }).select('_id'); 
            
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
        const { limit, difficulte } = req.query;

        console.log('Recherche questions pour:', { moduleId, limit, difficulte });

        // Construire le filtre
        let filter = { module: moduleId };
        if (difficulte) {
            filter.difficulte = new RegExp(`^${difficulte}$`, 'i'); // Case-insensitive
        }

        // Récupérer les questions
        const questions = await Question.find(filter)
            .populate('module', 'nom')
            .limit(parseInt(limit) || 10);

        console.log('Questions trouvées:', questions.length);

        // ✅ CORRECTION : Vérifier que questions existe et est un tableau
        if (!questions || !Array.isArray(questions)) {
            return res.status(200).json({
                success: true,
                questions: [],
                count: 0
            });
        }

        // ✅ CORRECTION : Ajouter une vérification avant le .map()
        const formattedQuestions = questions.map(question => {
            if (!question) return null;

            return {
                _id: question._id,
                enonce: question.enonce, // <-- use enonce
                type: question.type,
                difficulte: question.difficulte,
                points: question.points,
                options: question.options && Array.isArray(question.options)
                    ? question.options.map(opt => ({
                        text: opt?.text || '',
                        isCorrect: opt?.isCorrect || false
                    }))
                    : [],
                module: question.module ? {
                    _id: question.module._id,
                    nom: question.module.nom
                } : null,
                enseignant: question.enseignant ? {
                    _id: question.enseignant._id,
                    nom: question.enseignant.nom,
                    prenom: question.enseignant.prenom
                } : null,
                createdAt: question.createdAt
            };
        }).filter(q => q !== null); // ✅ Filtrer les questions nulles

        res.status(200).json({
            success: true,
            questions: formattedQuestions,
            count: formattedQuestions.length
        });

    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des questions',
            error: error.message
        });
    }
};
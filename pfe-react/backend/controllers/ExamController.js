// Dans la fonction qui gère les requêtes POST à /api/v1/exam
// Trouver cette section et la modifier:

exports.createExam = async (req, res) => {
    try {
        // Afficher tout le corps de la requête pour débogage
        console.log("Requête reçue:", JSON.stringify(req.body, null, 2));
        
        // Extraire tous les champs du corps de la requête 
        const { 
            module, filiere, section, enseignant, salle, 
            examType, difficulte, examDate, duree, 
            format, questions 
        } = req.body;

        // Vérification des champs obligatoires
        if (!module || !filiere || !section || !enseignant || !salle || 
            !examType || !difficulte || !examDate || !duree || 
            !format || !questions || questions.length === 0) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Créer l'examen avec toutes les données du payload
        const newExam = new Exam({
            module,
            filiere,
            section,
            enseignant,
            salle,
            examType,
            difficulte,
            examDate,
            duree,
            format,        // Conserver cette valeur telle quelle
            questions      // Conserver cette valeur telle quelle
        });

        // Sauvegarder et répondre
        const savedExam = await newExam.save();
        res.status(201).json({ 
            success: true, 
            exam: savedExam 
        });
    } catch (err) {
        res.status(500).json({ 
            message: err.message || "Erreur lors de la création de l'examen" 
        });
    }
};

import Question from '../models/Question';
import Reponse from '../models/Response';

export const createQuestion = async (req, res) => {
    const { question: questionText, reponse: reponseText, typeQuestion, idFiliere, idSection } = req.body;

    const Exam = await 

    const newQuestion = await Question.create({
        question: questionText,
        reponse: reponseText,
        typeQuestion,
        idFiliere,
        idSection,
    });

    const newReponse = await Reponse.create({
        reponse: reponseText,
        question: newQuestion._id,
    });

    const token = newQuestion.getJWTToken();

    res.status(201).json({
        success: true,
        token,
        question: newQuestion,
    });

    //find les questions in database
    const Findquestions = await Question.find({});
    if (!questions) {
        return res.status(401).json({
            success: false,
            message: 'Aucune question trouvée',
        });
    }

    res.status(200).json({
        success: true,
        questions,
    });


    
}


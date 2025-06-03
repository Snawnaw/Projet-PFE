const Notification = require('../models/Notification');
const Etudiant = require('../models/Etudiant');

const NotificationController = {
    sendExamLinkToStudents: async (req, res) => {
        const { examId, shareableLink, filiereId, sectionId } = req.body;

        // Fetch students based on filiere and section
        const students = await Etudiant.find({ filiere: filiereId, section: sectionId });

        if (!students.length) {
            return res.status(404).json({ success: false, message: 'No students found' });
        }

        // Create notifications for each student
        const notifications = students.map(student => ({
            user: student._id,
            userType: 'Etudiant',
            title: 'Nouvel Examen Disponible',
            message: `Cliquez sur le lien pour passer l'examen.`,
            link: shareableLink,
            type: 'exam',
        }));

        await Notification.insertMany(notifications);

        res.status(200).json({ success: true, message: 'Exam link sent to students' });
    },
};

console.log('Étudiants ciblés pour les notifications :', students);

module.exports = NotificationController;
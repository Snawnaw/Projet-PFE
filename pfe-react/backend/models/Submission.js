const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    exam: { 
        type: Schema.Types.ObjectId, 
        ref: 'Exam', 
        required: true 
    },
    student: { 
        type: Schema.Types.ObjectId, 
        ref: 'Etudiant', 
        required: true 
    },
    answers: { 
        type: Object, 
        required: true 
    },
    score: { 
        type: Number 
    },
    submittedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Submission', submissionSchema);
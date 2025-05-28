const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    examId: {
        type: Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: {
        type: Map,
        of: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Submission', submissionSchema);
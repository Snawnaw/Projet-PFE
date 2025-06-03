const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, refPath: 'userType', required: true },
  userType: { type: String, enum: ['Etudiant', 'Enseignant'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, enum: ['exam', 'result', 'alert'] },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
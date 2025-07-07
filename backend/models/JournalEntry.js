const mongoose = require('mongoose');
const JournalEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  mood: { type: String }, // e.g., 'happy', 'sad', 'neutral'
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
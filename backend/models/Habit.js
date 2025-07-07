const mongoose = require('mongoose');
const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  completedDates: [{ type: Date }],
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Habit', HabitSchema);
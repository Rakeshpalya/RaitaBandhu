const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: String, default: "farmer123" },
  name: { type: String, required: true },
  status: { type: String, default: "Due Today" },
  type: { type: String, enum: ['water', 'fertilizer', 'pest'], default: 'water' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);

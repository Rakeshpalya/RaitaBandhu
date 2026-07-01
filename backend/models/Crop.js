const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  userId: { type: String, default: "farmer123" },
  name: { type: String, required: true },
  datePlanted: { type: String, required: true },
  progress: { type: Number, default: 0 },
  emoji: { type: String, default: "🌱" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Crop', cropSchema);

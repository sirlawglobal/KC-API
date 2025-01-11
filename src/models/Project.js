const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['active', 'completed', 'on hold'], default: 'active' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    projectStartDate: { type: Date },
    projectEndDate: { type: Date },
    projectDetail: { type: String },
    description: { type: String },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
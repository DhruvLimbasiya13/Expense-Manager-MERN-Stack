const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    projectLogo: { type: String },
    projectStartDate: { type: Date },
    projectEndDate: { type: Date },
    projectDetail: { type: String },
    description: { type: String },
    
    // Foreign Key: UserID
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    isActive: { type: Boolean, default: true },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
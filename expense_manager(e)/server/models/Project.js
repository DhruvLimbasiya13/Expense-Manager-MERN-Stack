const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    startDate: String,
    endDate: String
});

module.exports = mongoose.model('Project', ProjectSchema);
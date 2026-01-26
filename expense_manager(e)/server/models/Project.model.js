const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    // Matches SQL: ProjectName VARCHAR(250) NOT NULL
    projectName: {
        type: String,
        required: true
    },

    // Matches SQL: ProjectLogo VARCHAR(250)
    projectLogo: {
        type: String
    },

    // Matches SQL: ProjectStartDate DATETIME
    projectStartDate: {
        type: Date
    },

    // Matches SQL: ProjectEndDate DATETIME
    projectEndDate: {
        type: Date
    },

    // Matches SQL: ProjectDetail VARCHAR(500)
    projectDetail: {
        type: String
    },

    // Matches SQL: Description VARCHAR(500)
    description: {
        type: String
    },

    // Matches SQL: UserID INT NOT NULL (Foreign Key)
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Matches SQL: IsActive BIT
    isActive: {
        type: Boolean,
        default: true
    },

    // Matches SQL: Created DATETIME
    created: {
        type: Date,
        default: Date.now
    },

    // Matches SQL: Modified DATETIME
    modified: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
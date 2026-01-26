const mongoose = require('mongoose');

const PeopleSchema = new mongoose.Schema({
    peopleCode: { type: String },
    password: { type: String, required: true },
    peopleName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNo: { type: String, required: true },
    description: { type: String },
    
    // Foreign Key: UserID
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    isActive: { type: Boolean, default: true },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('People', PeopleSchema);
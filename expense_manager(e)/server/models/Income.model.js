const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    incomeDate: { type: Date, required: true },
    
    // Foreign Keys
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subCategoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    peopleID: { type: mongoose.Schema.Types.ObjectId, ref: 'People', required: true },
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    
    amount: { type: Number, required: true },
    incomeDetail: { type: String },
    attachmentPath: { type: String },
    description: { type: String },
    
    // Foreign Key: UserID
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Income', IncomeSchema);
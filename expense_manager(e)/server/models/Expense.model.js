const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    expenseDate: { type: Date, required: true },
    
    // Foreign Keys (Nullable/Optional in SQL are usually handled by not making them required here)
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subCategoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    peopleID: { type: mongoose.Schema.Types.ObjectId, ref: 'People', required: true },
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    
    amount: { type: Number, required: true },
    expenseDetail: { type: String },
    attachmentPath: { type: String },
    description: { type: String },
    
    // Foreign Key: UserID (The admin/user who entered this record)
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
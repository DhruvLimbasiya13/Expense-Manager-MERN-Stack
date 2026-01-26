const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    expenseDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    
    // Foreign Keys
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    peopleID: { type: mongoose.Schema.Types.ObjectId, ref: 'People', required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    expenseDetail: { type: String }, // Remarks
    attachmentPath: { type: String },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
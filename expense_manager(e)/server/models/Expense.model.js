const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    expenseDate: { type: Date, required: true },
    amount: { type: Number, required: true },

    // Foreign Keys
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subCategoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    peopleID: { type: mongoose.Schema.Types.ObjectId, ref: 'People', required: true },
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    expenseDetail: { type: String },
    attachmentPath: { type: String },
    description: { type: String },

    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
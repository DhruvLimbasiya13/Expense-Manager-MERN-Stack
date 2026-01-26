const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    remarks: String
});

module.exports = mongoose.model('Expense', ExpenseSchema);
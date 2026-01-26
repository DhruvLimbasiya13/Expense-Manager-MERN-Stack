const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    source: String,
    remarks: String
});

module.exports = mongoose.model('Income', IncomeSchema);
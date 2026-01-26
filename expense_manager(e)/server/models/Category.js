const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    isExpense: { type: Boolean, default: false },
    isIncome: { type: Boolean, default: false }
});

module.exports = mongoose.model('Category', CategorySchema);
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    logoPath: { type: String },
    isExpense: { type: Boolean, required: true },
    isIncome: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true, default: true },
    description: { type: String },
    
    // Foreign Key: UserID
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    sequence: { type: Number },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);
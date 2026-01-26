const router = require('express').Router();
const Expense = require('../models/Expense');

// GET All
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find().populate('projectId categoryId');
        res.status(200).json(expenses);
    } catch (err) { res.status(500).json(err); }
});

// GET By ID
router.get('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        res.status(200).json(expense);
    } catch (err) { res.status(500).json(err); }
});

// POST (Create)
router.post('/', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        const saved = await newExpense.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Return the updated document
        );
        res.status(200).json(updatedExpense);
    } catch (err) { 
        res.status(500).json(err); 
    }
});

module.exports = router;
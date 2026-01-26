const router = require('express').Router();
const Expense = require('../models/Expense.model');

// GET All Expenses (With full details populated)
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find()
            .populate('categoryID', 'categoryName')
            .populate('subCategoryID', 'subCategoryName')
            .populate('projectID', 'projectName')
            .populate('peopleID', 'peopleName')
            .populate('userID', 'userName');

        res.status(200).json(expenses);
    } catch (err) { res.status(500).json(err); }
});

// GET Single Expense
router.get('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        res.status(200).json(expense);
    } catch (err) { res.status(500).json(err); }
});

// POST (Create)
router.post('/', async (req, res) => {
    try {
        const newExpense = new Expense({
            ...req.body,
            created: new Date(),
            modified: new Date()
        });
        const saved = await newExpense.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modified: new Date() },
            { new: true }
        );
        res.status(200).json(updatedExpense);
    } catch (err) { res.status(500).json(err); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;
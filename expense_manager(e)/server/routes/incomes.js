const router = require('express').Router();
const Income = require('../models/Income');

router.get('/', async (req, res) => {
    try {
        const incomes = await Income.find()
            .populate('categoryID', 'categoryName')
            .populate('subCategoryID', 'subCategoryName')
            .populate('projectID', 'projectName')
            .populate('peopleID', 'peopleName')
            .populate('userID', 'userName');
        res.status(200).json(incomes);
    } catch (err) { res.status(500).json(err); }
});

router.post('/', async (req, res) => {
    try {
        const newIncome = new Income({
            ...req.body,
            created: new Date(),
            modified: new Date()
        });
        const saved = await newIncome.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedIncome = await Income.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modified: new Date() },
            { new: true }
        );
        res.status(200).json(updatedIncome);
    } catch (err) { res.status(500).json(err); }
});

router.delete('/:id', async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;
const router = require('express').Router();
const Income = require('../models/Income');

router.get('/', async (req, res) => {
    try {
        const incomes = await Income.find().populate('projectId categoryId');
        res.status(200).json(incomes);
    } catch (err) { res.status(500).json(err); }
});

router.post('/', async (req, res) => {
    try {
        const newIncome = new Income(req.body);
        const saved = await newIncome.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

router.delete('/:id', async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updatedIncome = await Income.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.status(200).json(updatedIncome);
    } catch (err) { 
        res.status(500).json(err); 
    }
});

router.get('/:id', async (req, res) => {
    try {
        const income = await Income.findById(req.params.id)
            .populate('projectId categoryId'); 
        
        if (!income) {
            return res.status(404).json("Income record not found");
        }
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;
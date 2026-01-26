const router = require('express').Router();
const Category = require('../models/Category.model');

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ sequence: 1 });
        res.status(200).json(categories);
    } catch (err) { res.status(500).json(err); }
});

router.post('/', async (req, res) => {
    try {
        const newCategory = new Category({
            ...req.body,
            created: new Date(),
            modified: new Date()
        });
        const saved = await newCategory.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modified: new Date() },
            { new: true }
        );
        res.status(200).json(updatedCategory);
    } catch (err) { res.status(500).json(err); }
});

router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;
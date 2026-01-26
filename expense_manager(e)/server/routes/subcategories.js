const router = require('express').Router();
const SubCategory = require('../models/SubCategory.model');

router.get('/', async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate('categoryID', 'categoryName');
        res.status(200).json(subCategories);
    } catch (err) { res.status(500).json(err); }
});

// GET by Category ID (Useful for dropdowns)
router.get('/category/:id', async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ categoryID: req.params.id });
        res.status(200).json(subCategories);
    } catch (err) { res.status(500).json(err); }
});

router.post('/', async (req, res) => {
    try {
        const newSubCategory = new SubCategory({
            ...req.body,
            created: new Date(),
            modified: new Date()
        });
        const saved = await newSubCategory.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modified: new Date() },
            { new: true }
        );
        res.status(200).json(updatedSubCategory);
    } catch (err) { res.status(500).json(err); }
});

router.delete('/:id', async (req, res) => {
    try {
        await SubCategory.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;
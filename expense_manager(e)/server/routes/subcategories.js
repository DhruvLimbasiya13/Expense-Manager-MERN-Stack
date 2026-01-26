const router = require('express').Router();
const SubCategory = require('../models/SubCategory');

// GET All SubCategories
router.get('/', async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate('categoryId');
        res.status(200).json(subCategories);
    } catch (err) { res.status(500).json(err); }
});

// GET SubCategory by ID
router.get('/:id', async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id).populate('categoryId');
        if (!subCategory) return res.status(404).json("SubCategory not found");
        res.status(200).json(subCategory);
    } catch (err) { res.status(500).json(err); }
});

// GET SubCategories by Category ID (Useful for dropdown filtering)
router.get('/category/:categoryId', async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ categoryId: req.params.categoryId });
        res.status(200).json(subCategories);
    } catch (err) { res.status(500).json(err); }
});

// POST (Create)
router.post('/', async (req, res) => {
    try {
        const newSubCategory = new SubCategory(req.body);
        const saved = await newSubCategory.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

// PUT (Update)
router.put('/:id', async (req, res) => {
    try {
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedSubCategory);
    } catch (err) { res.status(500).json(err); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await SubCategory.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;
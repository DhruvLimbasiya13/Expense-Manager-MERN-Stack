const router = require('express').Router();
const People = require('../models/People');
// GET All Peoples
router.get('/', async (req, res) => {
    try {
        const peoples = await People.find().populate('userID', 'userName emailAddress');
        res.status(200).json(peoples);
    } catch (err) { res.status(500).json(err); }
});

// POST (Create new Person/Employee)
router.post('/', async (req, res) => {
    try {
        const newPeople = new People({
            ...req.body,
            created: new Date(),
            modified: new Date()
        });
        const saved = await newPeople.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updatedPeople = await People.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modified: new Date() },
            { new: true }
        );
        res.status(200).json(updatedPeople);
    } catch (err) { res.status(500).json(err); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await People.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;
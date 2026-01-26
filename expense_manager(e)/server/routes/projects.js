const router = require('express').Router();
const Project = require('../models/Project');

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('userID', 'userName');
        res.status(200).json(projects);
    } catch (err) { res.status(500).json(err); }
});

router.post('/', async (req, res) => {
    try {
        const newProject = new Project({
            ...req.body,
            created: new Date(),
            modified: new Date()
        });
        const saved = await newProject.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modified: new Date() },
            { new: true }
        );
        res.status(200).json(updatedProject);
    } catch (err) { res.status(500).json(err); }
});

router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;
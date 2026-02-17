const router = require('express').Router();
const Project = require('../models/Project.model'); 

// GET All Projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('userID', 'userName');
        res.status(200).json(projects);
    } catch (err) { res.status(500).json(err); }
});

// POST New Project
router.post('/', async (req, res) => {
    try {
        const newProject = new Project({
            ...req.body,
            created: new Date()
        });
        const saved = await newProject.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

// GET Project by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('userID', 'userName');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (err) { res.status(500).json(err); }
});

// PUT Update Project
router.put('/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate('userID', 'userName');
        if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(updatedProject);
    } catch (err) { res.status(500).json(err); }
});

// DELETE Project
router.delete('/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;
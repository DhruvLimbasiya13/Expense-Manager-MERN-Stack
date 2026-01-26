const router = require('express').Router();
const Project = require('../models/Project');

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (err) { res.status(500).json(err); }
});

router.post('/', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const saved = await newProject.save();
        res.status(200).json(saved);
    } catch (err) { res.status(500).json(err); }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedProject);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json("Project not found");
        }
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE Project
router.delete('/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        
        if (!deletedProject) {
            return res.status(404).json("Project not found");
        }
        
        res.status(200).json("Project has been deleted successfully");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
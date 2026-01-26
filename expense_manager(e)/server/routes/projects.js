const router = require('express').Router();
// 👇 IMPORT THE RENAMED MODEL FILE
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

module.exports = router;
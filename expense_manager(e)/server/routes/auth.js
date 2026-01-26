const router = require('express').Router();
const User = require('../models/User.model');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        // Map frontend "name" -> backend "userName" if needed, 
        // or expect the frontend to send exact keys.
        const newUser = new User({
            userName: req.body.userName || req.body.name,
            emailAddress: req.body.emailAddress || req.body.email,
            password: req.body.password,
            mobileNo: req.body.mobileNo || "0000000000", // Default if missing
            profileImage: req.body.profileImage || "",
            created: new Date(),
            modified: new Date()
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ emailAddress: req.body.email });
        
        if (!user || user.password !== req.body.password) {
            return res.status(400).json("Invalid credentials");
        }
        
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
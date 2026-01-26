const router = require('express').Router();
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || user.password !== req.body.password) {
            return res.status(400).json("Invalid credentials");
        }
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        console.log("❌ LOGIN ERROR:", err); // <--- ADD THIS LINE
        res.status(500).json(err);
    }
});

// POST /api/auth/register (To create users)
router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
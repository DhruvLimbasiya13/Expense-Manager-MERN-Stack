const router = require('express').Router();
const User = require('../models/User.model'); // Ensure this matches your User model filename

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            userName: req.body.userName,
            emailAddress: req.body.emailAddress,
            password: req.body.password,
            // Use the role from the form, or default to normal_user if missing
            role: req.body.role || "normal_user", 
            mobileNo: req.body.mobileNo || "0000000000"
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST /api/auth/login (Keep your existing login logic)
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ emailAddress: req.body.email }); // Note: emailAddress to match schema
        
        if (!user || user.password !== req.body.password) {
            return res.status(400).json("Invalid credentials");
        }
        
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET All Users (Keep this for the Dashboard)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;
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

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        let user;

        if (userType === 'employee') {
            // Check peoples collection for employee login
            const People = require('../models/People.model');
            user = await People.findOne({ email: email });

            if (!user || user.password !== password) {
                return res.status(400).json("Invalid credentials");
            }

            // Return employee data without password, add userType
            const { password: pwd, ...others } = user._doc;
            res.status(200).json({ ...others, userType: 'employee', role: 'employee' });

        } else {
            // Check users collection for admin/normal_user login
            user = await User.findOne({ emailAddress: email });

            if (!user || user.password !== password) {
                return res.status(400).json("Invalid credentials");
            }

            // Return user data without password, add userType
            const { password: pwd, ...others } = user._doc;
            res.status(200).json({ ...others, userType: 'admin' });
        }

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

// PUT /api/auth/:id - Update User
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE /api/auth/:id - Delete User
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
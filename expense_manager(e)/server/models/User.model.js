const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "normal_user" },
    mobileNo: { type: String, default: "" },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
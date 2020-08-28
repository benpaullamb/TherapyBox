const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    passHash: String,
    email: String,
    tasks: [
        {
            description: String,
            isComplete: Boolean
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
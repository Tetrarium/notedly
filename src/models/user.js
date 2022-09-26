const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: { unique: true }
        },
        email: {
            type: String,
            required: true,
            index: { unique: true }
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        }
    },
    {
        // Присваеваем поля createAt и updateAt с типом Date
        timestamp: true
    }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
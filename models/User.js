const mongoose = require('mongoose');

const { Schema } = mongoose;
// schema for creating user;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: new Date()
    }
});
const User = mongoose.model('user', UserSchema);
module.exports = User;
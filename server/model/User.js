const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String,
    password: String,
    role: {
        type: String,
        default: 'patient'
    },
    subject: {
        type: String,
        default: '001'
    },
    workId: {
        type: String,
        default: '2333333'
    }
})

const User = mongoose.model('user', schema);

module.exports = User;
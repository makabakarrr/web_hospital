const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    role: String,
    id: String,
    permission: Array
})

const Role = mongoose.model('role', schema);

module.exports = Role;
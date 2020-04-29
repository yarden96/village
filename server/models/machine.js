const mongoose = require('mongoose');

const machineSchema = mongoose.Schema({
    name: {
        type: String,
        unique:true,
        required:true
    },
    type: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required:true
    }
})

const Machine = mongoose.model('Machine', machineSchema);

module.exports = { Machine };
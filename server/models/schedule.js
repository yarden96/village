const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
    machineName: {
        type: String,
        required:true
    },
    userName: {
        type: String,
        required: true
    },
    machineType: {
        type: String,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = { Schedule };
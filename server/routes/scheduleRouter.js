const express = require('express');
const { Schedule } = require('../models/schedule');
const { validateSchedule } = require('../middleware/scheduleValidation');

const router = express.Router();

router.post('/api/schedule/addSchedule', validateSchedule, (req, res) => {
    let schedule = req.body.schedule;
    
    if(schedule._id == '') {
        delete schedule._id
    }
    Schedule.create(req.body.schedule, (err, doc) =>{
        if (err) return res.json({seccess: false, err: err._message});
        res.json({seccess: true, doc})
    })
})

router.post('/api/schedule/updateSchedule', validateSchedule, (req, res) => {
    let schedule = req.body.schedule;
    
    Schedule.findByIdAndUpdate(schedule._id, { $set: {...schedule}}, (err, doc) => {
        if (err) return res.json({seccess: false, err: err._message});
        res.json({seccess: true, doc})
    })
})

router.delete('/api/schedule/deleteSchedule', (req, res) => {
    Schedule.findByIdAndDelete(req.query.id, (err) =>{
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true})
    })
})

router.get('/api/schedule', (req, res) => {
    Schedule.find((err, docs) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, docs})
    })
})

router.get('/api/schedule/scheduleByMachine', (req, res) => {
    Schedule.find({machineName: req.query.name}, (err, scheduleList) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, scheduleList})
    })
})

module.exports = router;
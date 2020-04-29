const _ = require('lodash');
const { Schedule } = require('../models/schedule');
const { Machine } = require('../models/machine');

const validateSchedule = (req, res, next) =>{
    let schedule = req.body.schedule;
    
    if(!schedule.startTime || !schedule.endTime 
        || !schedule.machineName || !schedule.machineType 
        || !schedule.userName || !schedule.date) {
            return res.json({
                seccess: false,
                err: "All parameters must be set"
            })        
    }
    if (schedule.startTime >= schedule.endTime) {
        return res.json({
            seccess: false,
            err: "Statring time can't be after ending time"
        })
    }

    Machine.findOne({ name: schedule.machineName.toString() }, (err, machine) => {
        if (err) return res.json({seccess: false, err: "Error while addning a new schedule"});
        if (!machine || !machine.available) return res.json({seccess: false, err: "Machine invalid"});
        
        Schedule.find({date: schedule.date.toString(), machineName: schedule.machineName.toString()}, 
            (err, schedules) => {
                if (err) return res.json({seccess: false, err: "Error while addning a new schedule"});
                
                var collision = _.find(schedules, function (s){
                    if(schedule._id && s._id == schedule._id) return false;
                    
                    return (s.startTime <= schedule.startTime && s.endTime > schedule.startTime)
                        || (s.startTime <= schedule.endTime && s.endTime > schedule.endTime) 
                        || (s.startTime >= schedule.startTime && s.endTime < schedule.endTime) 
                })
            
                if (collision) {
                    return res.json({
                        seccess: false,
                        err: "The time you want isn't available"
                    })
                }
            
                req.body.type = machine.type;
            
                next();
        })
    }) 
}

module.exports = { validateSchedule };
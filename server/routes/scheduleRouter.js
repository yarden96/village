const express = require('express');
const { Schedule } = require('../models/schedule');
const { validateSchedule } = require('../middleware/scheduleValidation');

const router = express.Router();

router.post('/addSchedule', validateSchedule, (req, res) => {
    let schedule = req.body.schedule;
    
    if(schedule._id == '') {
        delete schedule._id
    }
    Schedule.create(req.body.schedule, (err, doc) =>{
        if (err) return res.json({seccess: false, err: err._message});
        res.json({seccess: true, doc})
    })
})

router.post('/updateSchedule', validateSchedule, (req, res) => {
    let schedule = req.body.schedule;
    
    Schedule.findByIdAndUpdate(schedule._id, { $set: {...schedule}}, (err, doc) => {
        if (err) return res.json({seccess: false, err: err._message});
        res.json({seccess: true, doc})
    })
})

router.delete('/deleteSchedule', (req, res) => {
    Schedule.findByIdAndDelete(req.query.id, (err) =>{
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true})
    })
})

router.get('/', (req, res) => {
    Schedule.find((err, docs) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, docs})
    })
})

router.get('/scheduleByMachine', (req, res) => {
  Schedule.find({machineName: req.query.name}, (err, schedules) => {
    if (err) return res.json({seccess: false, err});
      let scheduleList = schedules.map((schedule) => {
        schedule._doc.startTime = converTime(schedule.startTime);
        schedule._doc.endTime = converTime(schedule.endTime);
        console.log("schedule ", schedule );
            
        return schedule
      })

        console.log("scheduleListUpdated", scheduleList);
        
      res.json({seccess: true, scheduleList})
    })
})

const converTime = (time) => {
  let temp;
  time = time.toString();
  if(time.includes('.')) {
    if(time.length < 4) {
      temp = time.split('.');
      if(Number(temp[0]) < 10 && Number(temp[0]) > 0) {
        temp[0] = '0' + temp[0];
      }
      if(Number(temp[1]) < 10 && Number(temp[1]) > 0) {
        temp[1] = temp[1] + 0;
      }
      time = temp[0] + ':' + temp[1];
    } else {
      time = time.replace('.', ':');
    }
  } else if (time > 0 && time < 10){
    time = '0' + time + ':00'
  } else {
    time = time + ':00'
  }

  return time
}
module.exports = router;
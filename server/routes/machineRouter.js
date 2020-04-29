const express = require('express');
const { Machine } = require('../models/machine');

const router = express.Router();

router.post('/api/machine/addMachine', (req, res) => {
    Machine.create(req.body, (err, doc)=> {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, doc})
    })
});

router.post('/api/machine/updateMachine', (req, res) => {
    let machine = req.body;

    Machine.update({ name: machine.name }, { $set: {...machine}}, (err, doc) =>{
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, doc})
    })
})

router.delete('/api/machine/deleteMachine', (req,res) => {
    Machine.deleteOne({name: req.query.name}, (err) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true})
    })
});

router.get('/api/machine/machinesList', (req, res) => {
    console.log("here");
    
    Machine.find((err, machinesList) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, machinesList})
    })
})

router.get('/api/machine/getMachinesByType', (req, res) => {
    Machine.find({type: req.query.type}, (err, machinesList) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, machinesList})
    })
})

module.exports = router;
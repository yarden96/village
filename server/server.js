const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('./config').get(process.env.NODE_ENV);
const routes = require("./routes");
const {generateDuties} = require('./helpers/generateDuties');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE,  { useFindAndModify: false , useNewUrlParser: true, useUnifiedTopology: true});

const { User } = require('./models/user');
const { Machine } = require('./models/machine');
const { Schedule } = require('./models/schedule');
const { auth } = require('./middleware/auth');
const { validateSchedule } = require('./middleware/scheduleValidation');

app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization, X-Requested-With, X-HTTP-Method-Override, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');

  console.log("request ", req.method, req.originalUrl, req.body);
  
  next();
});

/// Users /// 
app.post('/api/user/register', (req, res) => {
    const user = new User(req.body.user);

    user.save((err, doc) => {
        if(err) return res.json({seccess:false, error:err});
        res.status(200).json({ seccess:true, user: doc });
    })
})

app.post('/api/user/login', (req, res) => {
    User.findOne({'id': req.body.id}, (err, user) => {
        if (!user) return res.json({isAuth:false, message:'Auth failed, user not found'});

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.json({isAuth:false, message:'Auth failed, user not found'});
            if(!isMatch) return res.json({
                isAuth:false,
                message:'Wrong Password'
            });

            user.generateToken((err, user) => {
                if(err) return res.statusCode(400).send(err);
                res.cookie('auth', user.token)
                .json({
                    isAuth: true,
                    id: user._id,
                    name: user.name,
                    role: user.role
                });
            })

        })
    })
})

app.get('/api/user/logout', auth, (req, res) => {
    req.user.deleteToken(req.token, (err, user) => {
        if(err) return res.statusCode(400).send(err);
        res.sendStatus(200);
    })

})

app.post('/api/user/updateUser', (req, res) => {
    let user = req.body;
    User.updateOne({"id": user.id},{ $set: { ...user } }, (err, doc) => {
        if(err) return res.json({error:err});
        res.json({seccess: true, doc})
    })
})

app.get('/api/user/isAuth', auth, (req, res) => {
    res.json({ 
        isAuth: true,
        id: req.user._id,
        name: req.user.name,
        role: req.user.role
     })
})

app.get('/api/user/getUsers', (req, res) => {
    User.find((err, docs) => {
        if(err) return res.json({error:err});
        res.json(docs)
    })
})

app.get('/api/user/getUser', (req, res) => {
    let query = req.query.search;
    if(isNaN(query)) {
        User.find(({ $or: [ { "name": {'$regex': query} }, 
                { "lastname": {'$regex': query} }, 
                { "id": {'$regex': query} }, 
                { "role": {'$regex': query} }] }) ,(err, doc) => {
            if(err) return res.send(err);
            if(!doc){
                return res.send('User Not Found');
            }
            return res.json(doc)
        })
    } else {
        User.find(({ $or: [ { "numberOfDuties": query }, 
                { "id": {'$regex': query} }] }) ,(err, doc) => {
            if(err) return res.send(err);
            if(!doc){
                return res.send('User Not Found');
            }
            res.json(doc)
        })
    }    
})

app.delete('/api/user/deleteUser', (req, res) => {
    User.deleteOne({id: req.query.id}, (err) => {
        if(err) return res.json({seccess: false, error: err});
        res.json({seccess: true})
    })
})
/// User ///

/// Machine ///
app.post('/api/machine/addMachine', (req, res) => {
    Machine.create(req.body, (err, doc)=> {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, doc})
    })
});

app.post('/api/machine/updateMachine', (req, res) => {
    let machine = req.body;

    Machine.update({ name: machine.name }, { $set: {...machine}}, (err, doc) =>{
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, doc})
    })
})

app.delete('/api/machine/deleteMachine', (req,res) => {
    Machine.deleteOne({name: req.query.name}, (err) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true})
    })
});

app.get('/api/machine/machinesList', (req, res) => {
    Machine.find((err, machinesList) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, machinesList})
    })
})

app.get('/api/machine/getMachinesByType', (req, res) => {
    Machine.find({type: req.query.type}, (err, machinesList) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, machinesList})
    })
})
/// Machine // 

// Schedule //
app.post('/api/schedule/addSchedule', validateSchedule, (req, res) => {
    let schedule = req.body.schedule;
    
    if(schedule._id == '') {
        delete schedule._id
    }
    Schedule.create(req.body.schedule, (err, doc) =>{
        if (err) return res.json({seccess: false, err: err._message});
        res.json({seccess: true, doc})
    })
})

app.post('/api/schedule/updateSchedule', validateSchedule, (req, res) => {
    let schedule = req.body.schedule;
    
    Schedule.findByIdAndUpdate(schedule._id, { $set: {...schedule}}, (err, doc) => {
        if (err) return res.json({seccess: false, err: err._message});
        res.json({seccess: true, doc})
    })
})

app.delete('/api/schedule/deleteSchedule', (req, res) => {
    Schedule.findByIdAndDelete(req.query.id, (err) =>{
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true})
    })
})

app.get('/api/schedule', (req, res) => {
    Schedule.find((err, docs) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, docs})
    })
})

app.get('/api/schedule/scheduleByMachine', (req, res) => {
    Schedule.find({machineName: req.query.name}, (err, scheduleList) => {
        if (err) return res.json({seccess: false, err});
        res.json({seccess: true, scheduleList})
    })
})
// Schedule ///

generateDuties();

const port = process.env.PORS || 3001;
app.listen(port, ()=> {
    console.log('Server running');
})

// Delete schedules that older then a day
let dayInMilliseconds = 1000 * 60 * 60 * 24;
setInterval(()=>{
    Schedule.find({},{"date": 1}, (err, docs) => {
        if(err) {
            console.log(err);
            return null;
        }
          
        docs.map((schedule) => {
            let schDate = moment(schedule.date, 'DD-MM');
            let today =  moment(new Date(), 'DD-MM')
            
            if(today.diff(schDate, 'days') >= 1) {
                Schedule.findByIdAndDelete(schedule._id, (err) =>{
                    if(err) console.log("err", err);
                });
            }
        })
    })
},dayInMilliseconds)
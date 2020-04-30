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

const { Schedule } = require('./models/schedule');

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

app.use('/api', routes);

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
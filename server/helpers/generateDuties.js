const moment = require('moment');
const { User } = require('../models/user');

function getDates(startDate, stopDate) {
    let dateArray = [];
    let day;
    let currentDate = moment(startDate);
    let endDate = moment(stopDate);

    while (currentDate <= endDate) {
        day = currentDate.format('dddd');
        if (day == 'Friday'){
            dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
        }
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

const generateDates = () => {
    let startDate = "2019-10-01";
    let stopDate = "2020-09-30";

    return getDates(startDate, stopDate)
}

const generateDuties = async (start, end, numberOfPeople) => {
    let users = await User.find({}).select({"name":1, "numberOfDuties":1, "id":1, "_id": 0});

    //console.log(generateDates() );
}

module.exports = { generateDuties, generateDates }; 
export default function(state={}, action){
    switch(action.type) {
        case 'GET_MACHINES':
            return {...state, machines:action.paylod}
        case 'SAVE_SCHEDULE':
            return {...state, schedule:action.paylod}
        case 'DELETE_SCHEDULE':
            return {...state, schedule:action.paylod}
        case 'GET_SCHEDULE_LAUNDRY':
            return {...state, laundrySchedule:action.paylod}
        case 'GET_SCHEDULE_DRYER':
            return {...state, dryerSchedule:action.paylod}
        default:
            return state;
    }
}
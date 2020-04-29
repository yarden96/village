export default function(state={}, action){
    switch(action.type) {
        case 'REGISTER_USER':
            return {...state, newUser:action.paylod}
        case 'UPDATE_USER':
            return {...state, newUser:action.paylod}
        case 'DELETE_USER':
            return {...state, newUser:action.paylod}
        case 'GET_USERS':
            return {...state, users:action.paylod}
        case 'GET_USER':
            return {...state, users:action.paylod}
        default:
            return state;
    }
}
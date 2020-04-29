export default function(state={}, action){
    switch(action.type) {
        case 'USER_LOGIN':
            return {...state, login:action.paylod}
        case 'IS_AUTH':
            return {...state, login:action.paylod}
        case 'USER_LOGOUT':
            return {...state, login:action.paylod}
        default:
            return state;
    }
}
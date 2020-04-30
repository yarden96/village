import { combineReducers } from 'redux';

import user from './user_reducer';
import manageUsers from './manageUsers_reducer';
import laundry from './laundry_reducer';

const rootReducer = combineReducers({
    user,
    manageUsers,
    laundry
});

export default rootReducer;
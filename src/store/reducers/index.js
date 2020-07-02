import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import account from './account';
import ad from './ad';
import admin from './admin';
import auth from './auth';
import bid from './bid';
import category from './category';
import mailbox from './mailbox';
import onlineStatus from './onlineStatus';
import password from './password';
import register from './register';

const rootReducer = combineReducers({
    form: formReducer,
    account,
    ad,
    admin,
    auth,
    bid,
    category,
    mailbox,
    onlineStatus,
    password,
    register,
});

export default rootReducer;

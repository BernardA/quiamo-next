import { HYDRATE } from 'next-redux-wrapper';
import {
    CHECK_ONLINE_STATUS_OK,
    CHECK_ONLINE_STATUS_ERROR,
} from '../actions';

const initialState = {
    isOnline: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case HYDRATE: {
        return { 
            ...state, 
            ...action.data,
        }
    }
    case CHECK_ONLINE_STATUS_OK:
    case CHECK_ONLINE_STATUS_ERROR:
        return {
            ...state,
            isOnline: action.isOnline,
        };
    default:
        return state;
    }
};

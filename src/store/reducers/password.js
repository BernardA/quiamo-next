import { HYDRATE } from 'next-redux-wrapper';
import {
    POST_PASSWORD_RECOVERY_REQUEST_INIT,
    POST_PASSWORD_RECOVERY_REQUEST_OK,
    POST_PASSWORD_RECOVERY_REQUEST_ERROR,
    POST_PASSWORD_RECOVERY_RESET_INIT,
    POST_PASSWORD_RECOVERY_RESET_OK,
    POST_PASSWORD_RECOVERY_RESET_ERROR,
    TOGGLE_VISIBLE_PASSWORD,
} from '../actions';

const initialState = {
    token: null,
    refreshToken: null,
    isLoading: false,
    errorReq: null,
    dataPasswordRequest: null,
    dataPasswordReset: null,
    isPasswordMasked: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case HYDRATE: {
        return { 
            ...state, 
            ...action.data,
        }
    }
    case POST_PASSWORD_RECOVERY_REQUEST_INIT:
    case POST_PASSWORD_RECOVERY_RESET_INIT:
        return {
            ...state,
            isLoading: true,
            errorReq: null,
        };
    case POST_PASSWORD_RECOVERY_REQUEST_ERROR:
    case POST_PASSWORD_RECOVERY_RESET_ERROR:
        return {
            ...state,
            errorReq: action.data,
            isLoading: false,
        };
    case POST_PASSWORD_RECOVERY_REQUEST_OK:
        return {
            ...state,
            isLoading: false,
            dataPasswordRequest: action.data,
        };
    case POST_PASSWORD_RECOVERY_RESET_OK:
        return {
            ...state,
            isLoading: false,
            dataPasswordReset: action.data,
        };
    case TOGGLE_VISIBLE_PASSWORD:
        return {
            ...state,
            isPasswordMasked: !state.isPasswordMasked,
        };
    default:
        return state;
    }
};

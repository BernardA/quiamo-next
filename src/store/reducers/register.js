import { HYDRATE } from 'next-redux-wrapper';
import {
    POST_ADDRESS_INIT,
    POST_ADDRESS_OK,
    POST_ADDRESS_ERROR,
    REGISTER_INIT,
    REGISTER_OK,
    REGISTER_ERROR,
    SOCIAL_REGISTER_GOOGLE_INIT,
    SOCIAL_REGISTER_GOOGLE_OK,
    SOCIAL_REGISTER_GOOGLE_ERROR,
    POST_USER_CONFIRM_INIT,
    POST_USER_CONFIRM_OK,
    POST_USER_CONFIRM_ERROR,
    PUT_REGISTER_SOCIAL_INIT,
    PUT_REGISTER_SOCIAL_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    errorAddress: null,
    errorRegister: null,
    errorSocial: null,
    errorConfirmation: null,
    errorPutSocial: null,
    dataAddress: null,
    dataRegister: null,
    dataGoogle: null,
    dataConfirmation: null,
    dataPutSocial: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case HYDRATE: {
        return { 
            ...state, 
            ...action.data,
        }
    }
    case POST_ADDRESS_INIT:
        return {
            ...state,
            isLoading: true,
            errorAddress: null,
            dataAddress: null,
        };
    case POST_ADDRESS_OK:
        return {
            ...state,
            isLoading: false,
            dataAddress: action.data,
        };
    case POST_ADDRESS_ERROR:
        return {
            ...state,
            isLoading: false,
            errorAddress: action.data,
        };
    case REGISTER_INIT:
        return {
            ...state,
            isLoading: true,
            errorRegister: null,
            dataRegister: null,
        };
    case REGISTER_OK:
        return {
            ...state,
            isLoading: false,
            dataRegister: action.data,
        };
    case REGISTER_ERROR:
        return {
            ...state,
            isLoading: false,
            errorRegister: action.data,
        };
    case SOCIAL_REGISTER_GOOGLE_INIT:
        return {
            ...state,
            isLoading: true,
            errorSocial: null,
            dataGoogle: null,
        };
    case SOCIAL_REGISTER_GOOGLE_OK:
        return {
            ...state,
            isLoading: false,
            dataGoogle: action.data,
        };
    case SOCIAL_REGISTER_GOOGLE_ERROR:
        return {
            ...state,
            isLoading: false,
            errorSocial: action.data,
        };
    case POST_USER_CONFIRM_INIT:
        return {
            ...state,
            isLoading: true,
            errorConfirmation: null,
            dataConfirmation: null,
        };
    case POST_USER_CONFIRM_OK:
        return {
            ...state,
            isLoading: false,
            dataConfirmation: action.data,
        };
    case POST_USER_CONFIRM_ERROR:
        return {
            ...state,
            isLoading: false,
            errorConfirmation: action.data,
        };
    case PUT_REGISTER_SOCIAL_INIT:
        return {
            ...state,
            isLoading: true,
            errorPutSocial: null,
        };
    case PUT_REGISTER_SOCIAL_ERROR:
        return {
            ...state,
            isLoading: false,
            errorPutSocial: action.data,
        };
    default:
        return state;
    }
};

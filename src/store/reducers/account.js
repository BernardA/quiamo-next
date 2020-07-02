import { HYDRATE } from 'next-redux-wrapper';
import {
    PUT_ADDRESS_INIT,
    PUT_ADDRESS_OK,
    PUT_ADDRESS_ERROR,
    PUT_PASSWORD_RESET_INIT,
    PUT_PASSWORD_RESET_OK,
    PUT_PASSWORD_RESET_ERROR,
    PUT_USER_PROFILE_INIT,
    PUT_USER_PROFILE_OK,
    PUT_USER_PROFILE_ERROR,
    UPLOAD_USER_IMAGE_INIT,
    UPLOAD_USER_IMAGE_OK,
    UPLOAD_USER_IMAGE_ERROR,
    POST_BLOCK_USER_INIT,
    POST_BLOCK_USER_OK,
    POST_BLOCK_USER_ERROR,
    DELETE_BLOCKED_USER_INIT,
    DELETE_BLOCKED_USER_OK,
    DELETE_BLOCKED_USER_ERROR,
    TOGGLE_USER_STATUS_INIT,
    TOGGLE_USER_STATUS_OK,
    TOGGLE_USER_STATUS_ERROR,
    POST_USER_AS_PROVIDER_INIT,
    POST_USER_AS_PROVIDER_OK,
    POST_USER_AS_PROVIDER_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    errorAddress: null,
    dataAddress: null,
    errorPasswordReset: null,
    dataPasswordReset: null,
    dataBlockUser: null,
    errorProfile: null,
    dataProfile: null,
    errorImage: null,
    errorBlockUser: null,
    dataImage: null,
    dataDeleteBlockedUser: null,
    errorDeleteBlockedUser: null,
    dataToggleUserStatus: null,
    errorToggleUserStatus: null,
    dataPostUserAsProvider: null,
    errorPostUserAsProvider: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case HYDRATE: {
        return { 
            ...state, 
            ...action.data,
        }
    }
    case PUT_ADDRESS_INIT:
        return {
            ...state,
            isLoading: true,
            errorAddress: null,
        };
    case PUT_ADDRESS_ERROR:
        return {
            ...state,
            errorAddress: action.data,
            isLoading: false,
        };
    case PUT_ADDRESS_OK:
        return {
            ...state,
            isLoading: false,
            dataAddress: action.data,
        };
    case PUT_PASSWORD_RESET_INIT:
        return {
            ...state,
            isLoading: true,
            errorPasswordReset: null,
        };
    case PUT_PASSWORD_RESET_ERROR:
        return {
            ...state,
            errorPasswordReset: action.data,
            isLoading: false,
        };
    case PUT_PASSWORD_RESET_OK:
        return {
            ...state,
            isLoading: false,
            dataPasswordReset: action.data,
        };
    case PUT_USER_PROFILE_INIT:
        return {
            ...state,
            isLoading: true,
            errorProfile: null,
            dataProfile: null,
        };
    case PUT_USER_PROFILE_ERROR:
        return {
            ...state,
            errorProfile: action.data,
            isLoading: false,
        };
    case PUT_USER_PROFILE_OK:
        return {
            ...state,
            isLoading: false,
            dataProfile: action.data,
        };
    case UPLOAD_USER_IMAGE_INIT:
        return {
            ...state,
            isLoading: true,
            errorImage: null,
        };
    case UPLOAD_USER_IMAGE_ERROR:
        return {
            ...state,
            isLoading: false,
            errorImage: action.data,
        };
    case UPLOAD_USER_IMAGE_OK:
        return {
            ...state,
            isLoading: false,
            dataImage: action.data,
        };
    case POST_BLOCK_USER_INIT:
        return {
            ...state,
            isLoading: true,
            dataBlockUser: null,
            errorBlockUser: null,
        };
    case POST_BLOCK_USER_OK:
        return {
            ...state,
            isLoading: false,
            dataBlockUser: action.data,
        };
    case POST_BLOCK_USER_ERROR:
        return {
            ...state,
            isLoading: false,
            errorBlockUser: action.data,
        };
    case DELETE_BLOCKED_USER_INIT:
        return {
            ...state,
            isLoading: true,
            dataDeleteBlockedUser: null,
            errorDeleteBlockedUser: null,
        };
    case DELETE_BLOCKED_USER_OK:
        return {
            ...state,
            isLoading: false,
            dataDeleteBlockedUser: action.data,
        };
    case DELETE_BLOCKED_USER_ERROR:
        return {
            ...state,
            isLoading: false,
            errorDeleteBlockedUser: action.data,
        };
    case TOGGLE_USER_STATUS_INIT:
        return {
            ...state,
            isLoading: true,
            errorToggleUserStatus: null,
            dataToggleUserStatus: null,
        };
    case TOGGLE_USER_STATUS_OK:
        return {
            ...state,
            isLoading: false,
            dataToggleUserStatus: action.data,
        };
    case TOGGLE_USER_STATUS_ERROR:
        return {
            ...state,
            isLoadin: false,
            errorToggleUserStatus: action.data,
        };
    case POST_USER_AS_PROVIDER_INIT:
        return {
            ...state,
            isLoading: true,
            dataPostUserAsProvider: null,
            errorPostUserAsProvider: null,
        };
    case POST_USER_AS_PROVIDER_OK:
        return {
            ...state,
            isLoading: false,
            dataPostUserAsProvider: action.data,
        };
    case POST_USER_AS_PROVIDER_ERROR:
        return {
            ...state,
            isLoading: false,
            errorPostUserAsProvider: action.data,
        };
    default:
        return state;
    }
};

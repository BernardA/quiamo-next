import { HYDRATE } from 'next-redux-wrapper';
import {
    GET_MAILBOX_INIT,
    GET_MAILBOX_OK,
    GET_MAILBOX_ERROR,
    POST_MESSAGE_INIT,
    POST_MESSAGE_OK,
    POST_MESSAGE_ERROR,
    POST_ATTACHMENTS_INIT,
    POST_ATTACHMENTS_OK,
    POST_ATTACHMENTS_ERROR,
    PUT_MESSAGE_UPDATE_STATUS_INIT,
    PUT_MESSAGE_UPDATE_STATUS_OK,
    PUT_MESSAGE_UPDATE_STATUS_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    errorReq: null,
    errorPostMessage: null,
    errorAttachments: null,
    errorStatusMessage: null,
    dataMailbox: null,
    dataMessage: null,
    dataAttachments: null,
    dataStatusMessage: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case HYDRATE: {
        return { 
            ...state, 
            ...action.data,
        }
    }
    case GET_MAILBOX_INIT:
        return {
            ...state,
            isLoading: false,
            errorReq: null,
            dataMailbox: null,
        };
    case POST_MESSAGE_INIT:
        return {
            ...state,
            isLoading: true,
            errorPostMessage: null,
            dataMessage: null,
        };
    case POST_ATTACHMENTS_INIT:
        return {
            ...state,
            isLoading: true,
            errorAttachments: null,
            dataAttachments: null,
        };
    case PUT_MESSAGE_UPDATE_STATUS_INIT:
        return {
            ...state,
            isLoading: false,
            errorReq: null,
            dataStatusMessage: null,
        };
    case GET_MAILBOX_OK:
        return {
            ...state,
            isLoading: false,
            dataMailbox: action.data,
        };
    case GET_MAILBOX_ERROR:
        return {
            ...state,
            errorReq: action.data,
            isLoading: false,
        };
    case POST_MESSAGE_OK:
        return {
            ...state,
            dataMessage: action.data,
            isLoading: false,
        };
    case POST_MESSAGE_ERROR:
        return {
            ...state,
            errorPostMessage: action.data,
            isLoading: false,
        };
    case POST_ATTACHMENTS_OK:
        return {
            ...state,
            dataAttachments: action.data,
        };
    case PUT_MESSAGE_UPDATE_STATUS_OK:
        return {
            ...state,
            dataStatusMessage: action.data,
        };
    case POST_ATTACHMENTS_ERROR:
        return {
            ...state,
            errorAttachments: action.data,
        };
    case PUT_MESSAGE_UPDATE_STATUS_ERROR:
        return {
            ...state,
            errorStatusMessage: action.data,
        };
    default:
        return state;
    }
};

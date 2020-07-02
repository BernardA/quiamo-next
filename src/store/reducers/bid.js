import { HYDRATE } from 'next-redux-wrapper';
import {
    POST_BID_INIT,
    POST_BID_OK,
    POST_BID_ERROR,
    DELETE_BID_INIT,
    DELETE_BID_OK,
    DELETE_BID_ERROR,
    POST_MESSAGE_FOR_BID_INIT,
    POST_MESSAGE_FOR_BID_OK,
    POST_MESSAGE_FOR_BID_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    errorPostBid: null,
    dataPostBid: null,
    errorMessageForBid: null,
    dataMessageForBid: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case HYDRATE: {
        return { 
            ...state, 
            ...action.data,
        }
    }
    case POST_BID_INIT:
        return {
            ...state,
            isLoading: true,
            errorPostBid: null,
            dataPostBid: null,
        };
    case POST_BID_OK:
        return {
            ...state,
            isLoading: false,
            dataPostBid: action.data,
        };
    case POST_BID_ERROR:
        return {
            ...state,
            isLoading: false,
            errorPostBid: action.data,
        };
    case DELETE_BID_INIT:
        return {
            ...state,
            isLoading: true,
            errorPostBid: null,
            dataPostBid: null,
        };
    case DELETE_BID_OK:
        return {
            ...state,
            isLoading: false,
            dataPostBid: action.data,
        };
    case DELETE_BID_ERROR:
        return {
            ...state,
            isLoading: false,
            errorPostBid: action.data,
        };
    case POST_MESSAGE_FOR_BID_INIT:
        return {
            ...state,
            isLoading: true,
            errorMessageForBid: null,
            dataMessageForBid: null,
        };
    case POST_MESSAGE_FOR_BID_OK:
        return {
            ...state,
            isLoading: false,
            dataMessageForBid: action.data,
        };
    case POST_MESSAGE_FOR_BID_ERROR:
        return {
            ...state,
            isLoading: false,
            errorMessageForBid: action.data,
        };
    default:
        return state;
    }
};

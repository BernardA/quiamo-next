import { HYDRATE } from 'next-redux-wrapper';
import {
    POST_AD_INIT,
    POST_AD_OK,
    POST_AD_ERROR,
    PUT_USER_TO_AD_INIT,
    PUT_USER_TO_AD_OK,
    PUT_USER_TO_AD_ERROR,
    GET_RECENT_ADS_INIT,
    GET_RECENT_ADS_OK,
    GET_RECENT_ADS_ERROR,
    GET_ADS_NEXT_INIT,
    GET_ADS_NEXT_OK,
    GET_ADS_NEXT_ERROR,
    GET_ADS_PREVIOUS_INIT,
    GET_ADS_PREVIOUS_OK,
    GET_ADS_PREVIOUS_ERROR,
    GET_AD_INIT,
    GET_AD_OK,
    GET_AD_ERROR,
    PUT_AD_INIT,
    PUT_AD_OK,
    PUT_AD_ERROR,
    DELETE_AD_INIT,
    DELETE_AD_OK,
    DELETE_AD_ERROR,
    TOGGLE_ACTIVE_AD_INIT,
    TOGGLE_ACTIVE_AD_OK,
    TOGGLE_ACTIVE_AD_ERROR,
    LOGOUT_TOKEN_EXPIRED,
    GET_USER_ADS_NEXT_INIT,
    GET_USER_ADS_NEXT_OK,
    GET_USER_ADS_NEXT_ERROR,
    GET_USER_ADS_PREVIOUS_INIT,
    GET_USER_ADS_PREVIOUS_OK,
    GET_USER_ADS_PREVIOUS_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    isLoadingAd: false,
    isLoadingUserAds: false,
    errorReq: null,
    dataAd: null,
    dataGetAd: null,
    dataAds: null,
    dataPutUser: null,
    dataPutAd: null,
    dataDeleteAd: null,
    dataToggleActiveAd: null,
    dataUserAds: null,
    dataRecentAds: null,
    errorRecentAds: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case HYDRATE: {
        return { 
            ...state, 
            ...action.data,
        }
    }
    case POST_AD_INIT:
        return {
            ...state,
            isLoadingAd: true,
            errorReq: null,
            dataAd: null,
        };
    case POST_AD_ERROR:
        return {
            ...state,
            errorReq: action.data,
            isLoadingAd: false,
        };
    case POST_AD_OK:
        return {
            ...state,
            isLoadingAd: false,
            dataAd: action.data,
        };
    case PUT_USER_TO_AD_INIT:
        return {
            ...state,
            errorReq: null,
        };
    case PUT_USER_TO_AD_OK:
        return {
            ...state,
            dataPutUser: action.data,
        };
    case PUT_USER_TO_AD_ERROR:
        return {
            ...state,
            errorReq: action.data,
        };
    case GET_ADS_NEXT_INIT:
    case GET_ADS_PREVIOUS_INIT:
        return {
            ...state,
            isLoading: true,
            errorReq: null,
            dataAds: null,
        };
    case GET_ADS_NEXT_OK:
    case GET_ADS_PREVIOUS_OK:
        return {
            ...state,
            dataAds: action.data,
            isLoading: false,
        };
    case GET_ADS_NEXT_ERROR:
    case GET_ADS_PREVIOUS_ERROR:
        return {
            ...state,
            errorReq: action.data,
            isLoadingAd: false,
            dataAds: null,
        };
    case GET_AD_INIT:
        return {
            ...state,
            isLoadingAd: true,
            errorReq: null,
            dataGetAd: null,
        };
    case GET_AD_OK:
        return {
            ...state,
            dataGetAd: action.data,
            isLoadingAd: false,
        };
    case GET_AD_ERROR:
        return {
            ...state,
            errorReq: action.data,
            isLoadingAd: false,
        };
    case PUT_AD_INIT:
        return {
            ...state,
            isLoading: true,
            errorReq: null,
            dataPutAd: null,
        };
    case PUT_AD_OK:
        return {
            ...state,
            isLoading: false,
            dataPutAd: action.data,
        };
    case PUT_AD_ERROR:
        return {
            ...state,
            isLoading: false,
            errorReq: action.data,
        };
    case DELETE_AD_INIT:
        return {
            ...state,
            isLoading: true,
            errorReq: null,
            dataDeleteAd: null,
        };
    case DELETE_AD_OK:
        return {
            ...state,
            isLoading: false,
            dataDeleteAd: action.data,
        };
    case DELETE_AD_ERROR:
        return {
            ...state,
            isLoading: false,
            errorReq: action.data,
        };
    case TOGGLE_ACTIVE_AD_INIT:
        return {
            ...state,
            isLoading: true,
            errorReq: null,
            dataToggleActiveAd: null,
        };
    case TOGGLE_ACTIVE_AD_OK:
        return {
            ...state,
            isLoading: false,
            dataToggleActiveAd: action.data,
        };
    case TOGGLE_ACTIVE_AD_ERROR:
        return {
            ...state,
            isLoading: false,
            errorReq: action.data,
        };
    case LOGOUT_TOKEN_EXPIRED:
        return {
            ...state,
            isLoading: false,
            isLoadingAd: false,
        };
    case GET_USER_ADS_NEXT_INIT:
        return {
            ...state,
            isLoadingUserAds: true,
            dataUserAds: null,
        };
    case GET_USER_ADS_NEXT_OK:
        return {
            ...state,
            isLoadingUserAds: false,
            dataUserAds: action.data,
        };
    case GET_USER_ADS_NEXT_ERROR:
        return {
            ...state,
            isLoadingUserAds: false,
            errorReq: action.data,
        };
    case GET_USER_ADS_PREVIOUS_INIT:
        return {
            ...state,
            isLoadingUserAds: true,
            dataUserAds: null,
        };
    case GET_USER_ADS_PREVIOUS_OK:
        return {
            ...state,
            isLoadingUserAds: false,
            dataUserAds: action.data,
        };
    case GET_USER_ADS_PREVIOUS_ERROR:
        return {
            ...state,
            isLoadingUserAds: false,
            errorReq: action.data,
        };
    case GET_RECENT_ADS_INIT:
        return {
            ...state,
            errorRecentAds: null,
            dataRecentAds: null,
        };
    case GET_RECENT_ADS_OK:
        return {
            ...state,
            dataRecentAds: action.data,
        };
    case GET_RECENT_ADS_ERROR:
        return {
            ...state,
            errorRecentAds: action.data,
        };
    default:
        return state;
    }
};

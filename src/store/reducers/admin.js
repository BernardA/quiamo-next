import { HYDRATE } from 'next-redux-wrapper';
import {
    GET_USERS_NEXT_INIT,
    GET_USERS_NEXT_OK,
    GET_USERS_NEXT_ERROR,
    GET_USERS_PREVIOUS_INIT,
    GET_USERS_PREVIOUS_OK,
    GET_USERS_PREVIOUS_ERROR,
    GET_USER_INIT,
    GET_USER_OK,
    GET_USER_ERROR,
    GET_USERS_ALL_INIT,
    GET_USERS_ALL_OK,
    GET_USERS_ALL_ERROR,
    GET_CHARTS_DATA_INIT_INIT,
    GET_CHARTS_DATA_INIT_OK,
    GET_CHARTS_DATA_INIT_ERROR,
    GET_ADS_GROUPBY_CATEGORY_INIT,
    GET_ADS_GROUPBY_CATEGORY_OK,
    GET_ADS_GROUPBY_CATEGORY_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    dataUsers: null,
    errorUsers: null,
    dataUser: null,
    errorUser: null,
    dataUsersAll: null,
    errorUsersAll: null,
    dataChartsDataInit: null,
    errorChartsDataInit: null,
    dataAdsGroupByCategory: null,
    errorAdsGroupByCategory: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case HYDRATE: {
        return { 
            ...state, 
            ...action.data,
        }
    }
    case GET_USERS_NEXT_INIT:
    case GET_USERS_PREVIOUS_INIT:
        return {
            ...state,
            isLoading: true,
            errorUsers: null,
        };
    case GET_USERS_NEXT_OK:
    case GET_USERS_PREVIOUS_OK:
        return {
            ...state,
            isLoading: false,
            dataUsers: action.data,
        };
    case GET_USERS_NEXT_ERROR:
    case GET_USERS_PREVIOUS_ERROR:
        return {
            ...state,
            isLoading: false,
            errorUsers: action.data,
        };
    case GET_USER_INIT:
        return {
            ...state,
            isLoading: true,
            errorUser: null,
        };
    case GET_USER_OK:
        return {
            ...state,
            isLoading: false,
            dataUser: action.data,
        };
    case GET_USER_ERROR:
        return {
            ...state,
            isLoading: false,
            errorUser: action.data,
        };
    case GET_USERS_ALL_INIT:
        return {
            ...state,
            isLoading: true,
            dataUsersAll: null,
            errorUsersAll: null,
        };
    case GET_USERS_ALL_OK:
        return {
            ...state,
            isLoading: false,
            dataUsersAll: action.data,
        };
    case GET_USERS_ALL_ERROR:
        return {
            ...state,
            isLoading: false,
            errorUsersAll: action.data,
        };
    case GET_CHARTS_DATA_INIT_INIT:
        return {
            ...state,
            isLoading: true,
            errorChartsDataInit: null,
        };
    case GET_CHARTS_DATA_INIT_OK:
        return {
            ...state,
            isLoading: false,
            dataChartsDataInit: action.data,
        };
    case GET_CHARTS_DATA_INIT_ERROR:
        return {
            ...state,
            isLoading: false,
            errorChartsDataInit: action.data,
        };
    case GET_ADS_GROUPBY_CATEGORY_INIT:
        return {
            ...state,
            isLoading: true,
            errorAdsGroupByCategory: null,
        };
    case GET_ADS_GROUPBY_CATEGORY_OK:
        return {
            ...state,
            isLoading: false,
            dataAdsGroupByCategory: action.data,
        };
    case GET_ADS_GROUPBY_CATEGORY_ERROR:
        return {
            ...state,
            isLoading: false,
            errorAdsGroupByCategory: action.data,
        };
    default:
        return state;
    }
};

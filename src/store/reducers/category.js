import { HYDRATE } from 'next-redux-wrapper';
import {
    POST_CATEGORY_INIT,
    POST_CATEGORY_OK,
    POST_CATEGORY_ERROR,
    GET_CATEGORIES_INIT,
    GET_CATEGORIES_OK,
    GET_CATEGORIES_ERROR,
    DELETE_CATEGORY_INIT,
    DELETE_CATEGORY_OK,
    DELETE_CATEGORY_ERROR,
    PUT_CATEGORY_INIT,
    PUT_CATEGORY_OK,
    PUT_CATEGORY_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    errorPostCategory: null,
    dataPostCategory: null,
    errorGetCategories: null,
    dataGetCategories: null,
    errorDeleteCategory: null,
    dataDeleteCategory: null,
    errorPutCategory: null,
    dataPutCategory: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case HYDRATE: {
        return { 
            ...state, 
            ...action.data,
        }
    }
    case POST_CATEGORY_INIT:
        return {
            ...state,
            isLoading: true,
            errorPostCategory: null,
            dataPostCategory: null,
        };
    case POST_CATEGORY_OK:
        return {
            ...state,
            isLoading: false,
            dataPostCategory: action.data,
        };
    case POST_CATEGORY_ERROR:
        return {
            ...state,
            isLoading: false,
            errorPostCategory: action.data,
        };
    case GET_CATEGORIES_INIT:
        return {
            ...state,
            isLoading: true,
            errorGetCategories: null,
            dataGetCategories: null,
        };
    case GET_CATEGORIES_OK:
        return {
            ...state,
            isLoading: false,
            dataGetCategories: action.data,
        };
    case GET_CATEGORIES_ERROR:
        return {
            ...state,
            isLoading: false,
            errorGetCategories: action.data,
        };
    case DELETE_CATEGORY_INIT:
        return {
            ...state,
            isLoading: true,
            errorDeleteCategory: null,
            dataDeleteCategory: null,
        };
    case DELETE_CATEGORY_OK:
        return {
            ...state,
            isLoading: false,
            dataDeleteCategory: action.data,
        };
    case DELETE_CATEGORY_ERROR:
        return {
            ...state,
            isLoading: false,
            errorDeleteCategory: action.data,
        };
    case PUT_CATEGORY_INIT:
        return {
            ...state,
            isLoading: true,
            errorPutCategory: null,
            dataPutCategory: null,
        };
    case PUT_CATEGORY_OK:
        return {
            ...state,
            isLoading: false,
            dataPutCategory: action.data,
        };
    case PUT_CATEGORY_ERROR:
        return {
            ...state,
            isLoading: false,
            errorPutCategory: action.data,
        };
    default:
        return state;
    }
};

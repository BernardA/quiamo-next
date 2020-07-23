import {
    all, call, put, takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';
import localforage from 'localforage';
import { Now } from '../tools/functions';
import { parseApiErrors } from '../tools/apiUtils';
import {
    POST_LOGIN,
    POST_LOGIN_INIT,
    POST_LOGIN_OK,
    POST_LOGIN_ERROR,
    POST_SOCIAL_LOGIN_GOOGLE,
    POST_SOCIAL_LOGIN_GOOGLE_INIT,
    POST_SOCIAL_LOGIN_GOOGLE_ERROR,
    GET_USER_PROFILE,
    GET_USER_PROFILE_INIT,
    GET_USER_PROFILE_OK,
    GET_USER_PROFILE_ERROR,
    PUT_USER_PROFILE,
    PUT_USER_PROFILE_INIT,
    PUT_USER_PROFILE_OK,
    PUT_USER_PROFILE_ERROR,
    PUT_USER_PROFILE_OK_NEW_TOKEN,
    LOGOUT_TOKEN_EXPIRED,
    REFRESH_TOKEN,
    REFRESH_TOKEN_INIT,
    REFRESH_TOKEN_OK,
    REFRESH_TOKEN_ERROR,
    CHECK_ONLINE_STATUS,
    CHECK_ONLINE_STATUS_OK,
    CHECK_ONLINE_STATUS_ERROR,
    SOCIAL_REGISTER_GOOGLE,
    SOCIAL_REGISTER_GOOGLE_INIT,
    SOCIAL_REGISTER_GOOGLE_OK,
    SOCIAL_REGISTER_GOOGLE_ERROR,
    POST_ADDRESS,
    POST_ADDRESS_INIT,
    POST_ADDRESS_OK,
    POST_ADDRESS_ERROR,
    PUT_ADDRESS,
    PUT_ADDRESS_INIT,
    PUT_ADDRESS_OK,
    PUT_ADDRESS_ERROR,
    REGISTER,
    REGISTER_INIT,
    REGISTER_OK,
    REGISTER_ERROR,
    POST_USER_CONFIRM,
    POST_USER_CONFIRM_OK,
    POST_USER_CONFIRM_INIT,
    POST_USER_CONFIRM_ERROR,
    POST_PASSWORD_RECOVERY_REQUEST,
    POST_PASSWORD_RECOVERY_REQUEST_INIT,
    POST_PASSWORD_RECOVERY_REQUEST_OK,
    POST_PASSWORD_RECOVERY_REQUEST_ERROR,
    POST_PASSWORD_RECOVERY_RESET,
    POST_PASSWORD_RECOVERY_RESET_INIT,
    POST_PASSWORD_RECOVERY_RESET_OK,
    POST_PASSWORD_RECOVERY_RESET_ERROR,
    PUT_PASSWORD_RESET,
    PUT_PASSWORD_RESET_INIT,
    PUT_PASSWORD_RESET_OK,
    PUT_PASSWORD_RESET_ERROR,
    PUT_REGISTER_SOCIAL,
    PUT_REGISTER_SOCIAL_INIT,
    PUT_REGISTER_SOCIAL_ERROR,
    POST_AD,
    POST_AD_INIT,
    POST_AD_OK,
    POST_AD_ERROR,
    GET_AD,
    GET_AD_INIT,
    GET_AD_OK,
    GET_AD_ERROR,
    PUT_USER_TO_AD,
    PUT_USER_TO_AD_INIT,
    PUT_USER_TO_AD_OK,
    PUT_USER_TO_AD_ERROR,
    UPLOAD_USER_IMAGE,
    UPLOAD_USER_IMAGE_INIT,
    UPLOAD_USER_IMAGE_OK,
    UPLOAD_USER_IMAGE_ERROR,
    GET_RECENT_ADS,
    GET_RECENT_ADS_INIT,
    GET_RECENT_ADS_OK,
    GET_RECENT_ADS_ERROR,
    GET_ADS_NEXT,
    GET_ADS_NEXT_INIT,
    GET_ADS_NEXT_OK,
    GET_ADS_NEXT_ERROR,
    GET_ADS_PREVIOUS,
    GET_ADS_PREVIOUS_INIT,
    GET_ADS_PREVIOUS_OK,
    GET_ADS_PREVIOUS_ERROR,
    GET_MAILBOX,
    GET_MAILBOX_INIT,
    GET_MAILBOX_OK,
    GET_MAILBOX_ERROR,
    POST_MESSAGE,
    POST_MESSAGE_INIT,
    POST_MESSAGE_OK,
    POST_MESSAGE_ERROR,
    POST_MESSAGE_FOR_BID,
    POST_MESSAGE_FOR_BID_INIT,
    POST_MESSAGE_FOR_BID_OK,
    POST_MESSAGE_FOR_BID_ERROR,
    POST_ATTACHMENTS,
    POST_ATTACHMENTS_INIT,
    POST_ATTACHMENTS_OK,
    POST_ATTACHMENTS_ERROR,
    PUT_MESSAGE_UPDATE_STATUS,
    PUT_MESSAGE_UPDATE_STATUS_INIT,
    PUT_MESSAGE_UPDATE_STATUS_OK,
    PUT_MESSAGE_UPDATE_STATUS_ERROR,
    POST_BLOCK_USER,
    POST_BLOCK_USER_INIT,
    POST_BLOCK_USER_OK,
    POST_BLOCK_USER_ERROR,
    DELETE_BLOCKED_USER,
    DELETE_BLOCKED_USER_INIT,
    DELETE_BLOCKED_USER_OK,
    DELETE_BLOCKED_USER_ERROR,
    POST_BID,
    POST_BID_INIT,
    POST_BID_OK,
    POST_BID_ERROR,
    PUT_AD,
    PUT_AD_INIT,
    PUT_AD_OK,
    PUT_AD_ERROR,
    DELETE_AD,
    DELETE_AD_INIT,
    DELETE_AD_OK,
    DELETE_AD_ERROR,
    TOGGLE_ACTIVE_AD,
    TOGGLE_ACTIVE_AD_INIT,
    TOGGLE_ACTIVE_AD_OK,
    TOGGLE_ACTIVE_AD_ERROR,
    DELETE_BID,
    DELETE_BID_INIT,
    DELETE_BID_OK,
    DELETE_BID_ERROR,
    GET_USERS_NEXT,
    GET_USERS_NEXT_INIT,
    GET_USERS_NEXT_OK,
    GET_USERS_NEXT_ERROR,
    GET_USERS_PREVIOUS,
    GET_USERS_PREVIOUS_INIT,
    GET_USERS_PREVIOUS_OK,
    GET_USERS_PREVIOUS_ERROR,
    TOGGLE_USER_STATUS,
    TOGGLE_USER_STATUS_INIT,
    TOGGLE_USER_STATUS_OK,
    TOGGLE_USER_STATUS_ERROR,
    GET_USER_ADS_NEXT,
    GET_USER_ADS_NEXT_INIT,
    GET_USER_ADS_NEXT_OK,
    GET_USER_ADS_NEXT_ERROR,
    GET_USER_ADS_PREVIOUS,
    GET_USER_ADS_PREVIOUS_INIT,
    GET_USER_ADS_PREVIOUS_OK,
    GET_USER_ADS_PREVIOUS_ERROR,
    GET_USER,
    GET_USER_INIT,
    GET_USER_OK,
    GET_USER_ERROR,
    POST_CATEGORY,
    POST_CATEGORY_INIT,
    POST_CATEGORY_OK,
    POST_CATEGORY_ERROR,
    GET_CATEGORIES,
    GET_CATEGORIES_INIT,
    GET_CATEGORIES_OK,
    GET_CATEGORIES_ERROR,
    DELETE_CATEGORY,
    DELETE_CATEGORY_INIT,
    DELETE_CATEGORY_OK,
    DELETE_CATEGORY_ERROR,
    PUT_CATEGORY,
    PUT_CATEGORY_INIT,
    PUT_CATEGORY_OK,
    PUT_CATEGORY_ERROR,
    GET_USERS_ALL,
    GET_USERS_ALL_INIT,
    GET_USERS_ALL_OK,
    GET_USERS_ALL_ERROR,
    GET_CHARTS_DATA_INIT,
    GET_CHARTS_DATA_INIT_INIT,
    GET_CHARTS_DATA_INIT_OK,
    GET_CHARTS_DATA_INIT_ERROR,
    GET_ADS_GROUPBY_CATEGORY,
    GET_ADS_GROUPBY_CATEGORY_INIT,
    GET_ADS_GROUPBY_CATEGORY_OK,
    GET_ADS_GROUPBY_CATEGORY_ERROR,
    POST_USER_AS_PROVIDER,
    POST_USER_AS_PROVIDER_INIT,
    POST_USER_AS_PROVIDER_OK,
    POST_USER_AS_PROVIDER_ERROR,
} from '../store/actions';

const API_REST = 'API_REST';

const api = (
    method,
    urlSuffix,
    data = null,
    endpoint = API_REST,
    auth = true, // require bearer token
) => {
    // update last active on indexeddb
    if (endpoint !== 'favicon') {
        localforage.setItem('lastActiveAt', Now());
    }
    let url = `${process.env.NEXT_PUBLIC_API_REST_URL}${urlSuffix}`;
    if (endpoint !== API_REST) {
        url = urlSuffix;
    }
    if (!auth) {
        return axios({
            method,
            url,
            data,
            headers: {},
        }).then((response) => {
            return response.data;
        });
    }
    return axios({
        method,
        url,
        data,
    }).then((response) => {
        return response.data;
    });
};

export const apiQl = (data, variables = null, isForage = true) => {
    // update last active on indexeddb
    if (isForage) {
        localforage.setItem('lastActiveAt', Now());
    }
    return axios.post(process.env.NEXT_PUBLIC_API_GRAPHQL_URL, {
        query: data,
        variables,
    }).then((response) => {
        return response.data;
    });
};

const apiStd = (
    urlSuffix,
    data = null,
) => {
    const url = `${process.env.NEXT_PUBLIC_API_HOST}${urlSuffix}`;
    return axios.post(
        url,
        data,
    ).then((response) => {
        return response.data;
    });
};

function errorParser(error) {
    // console.log('error parser', error);
    const title = 'error';
    const description = error['hydra:description'];
    const parsedE = [];
    const obj = {};
    obj[title] = description;
    parsedE.push(obj);
    return parsedE;
}

function violationParser(error) {
    // console.log('VIOLATION parser', error);
    const statusCode = error.status;
    let data = [];
    if (statusCode === 401) {
        data[0] = error.data;
    } else if (statusCode === 400) {
        const violations = error.data.violations;
        data = parseApiErrors(violations);
    } else if (statusCode === 403) {
        data = errorParser(error.data);
    } else if (statusCode === 500) {
        data.push(
            {
                error: 'System error. Please try again or contact us',
            },
        );
    }
    return data;
}

function errorParserGraphql(errors) {
    if (errors[0].message === 'Expired JWT Token') {
        return 'token expired';
    }
    if (errors[0].message === 'Access Denied.') {
        return [{ message: 'You are not authorized to perform this action.' }];
    }
    const parsedE = [];
    errors.forEach((error) => {
        // graphql variable error
        if (error.message.startsWith('Variable ')) {
            const origKey = error.message.match(/\$[a-zA-z0-9]+/gm);
            let key = origKey[0].replace('$', '');
            const position = key.search(/[A-Z]/);
            if (position !== -1) {
                key = key.toLowerCase();
                key = `${key.slice(0, position)} ${key.slice(position)}`;
            }
            const obj = {};
            obj[key] = error.message.replace(`Variable "${origKey}"`, '');
            parsedE.push(obj);
        } else { // symfony validation error
            const split = error.message.split(':');
            const key = split[0].trim();
            const obj = {};
            obj[key] = split[1].trim();
            parsedE.push(obj);
        }
    });
    return parsedE;
}
/*
function* handleOffline() {
    // check if offline event already fired
    localforage.getItem('offline-event-fired').then((data) => {
        if (data === null) {
            localforage.setItem('offline-event-fired', true);
        }
    });
    yield put({
        type: CHECK_ONLINE_STATUS_ERROR,
        isOnline: false,
    });
}
*/
function* postLogin(action) {
    const username = action.values.username;
    const password = action.values.password;
    // const _remember_me = action.payload._remember_me;
    const url = '/login_check';
    try {
        yield put({
            type: POST_LOGIN_INIT,
        });
        const data = yield call(api, 'post', url, { username, password }, API_REST, false);
        yield put({
            type: POST_LOGIN_OK,
            data,
        });
        axios.defaults.headers.common = { Authorization: `Bearer ${data.token}` };
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = [
                {
                    message: error.response.data.message,
                },
            ];
        }
        yield put({
            type: POST_LOGIN_ERROR,
            data,
        });
    }
}

function* postSocialLoginGoogle(action) {
    const googleToken = action.token;
    const url = '/login_google';
    try {
        yield put({
            type: POST_SOCIAL_LOGIN_GOOGLE_INIT,
        });

        const data = yield call(api, 'post', url, { googleToken }, API_REST, false);
        // social login === regular login, so place same action
        yield put({
            type: POST_LOGIN_OK,
            data,
        });
        axios.defaults.headers.common = { Authorization: `Bearer ${data.token}` };
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = violationParser(error.response);
        }

        yield put({
            type: POST_SOCIAL_LOGIN_GOOGLE_ERROR,
            data,
        });
    }
}

function* getUserProfile(action) {
    const userId = `/api/users/${action.payload.userId}`;
    const queryQl = `query userProfile(
        $userId: ID!
        $isDeletedAd: Boolean
        $isDeletedBid: Boolean
        ){
        retrievedQueryUser(
            id: $userId, 
        ){
            _id
            id
            username
            name
            email
            roles
            createdAt
            address{
                id
                address1
                address2
                address3
                city
                postalCode
            }
            image{
                filename
            }
            ads(
                isDeleted: $isDeletedAd
                _order:{createdAt: "DESC"}
                ){
                totalCount
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                }
                edges{
                    node{
                        _id
                        id
                        description
                        createdAt
                        isActive
                        isDeleted
                        category{
                            _id
                            id
                            title
                        }
                        bids(isDeleted: $isDeletedBid){
                            id
                        }
                    }
                }
            }
            bids(
                isDeleted: $isDeletedBid
                _order: {message_sentAt: "DESC"}
            ){
                _id
                id
                isDeleted
                    bidType
                    bid
                    message{
                    _id
                    id
                    sentAt
                    message
                }
                ad{
                    id
                    _id
                    description
                    category{
                        _id
                        id
                        title
                    }
                    isDeleted
                    isActive
                }
            }
            blockedUsers{
                id
                blocked{
                    id
                    username
                }
            }
            blockedByUsers{
                blocker{
                    id
                }
            }
        }
    }`;

    const variables = {
        userId,
        isDeletedAd: false,
        isDeletedBid: false,
    };

    try {
        yield put({
            type: GET_USER_PROFILE_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_USER_PROFILE_ERROR,
                    data: errors,
                    userId,
                });
            }
        } else {
            yield put({
                type: GET_USER_PROFILE_OK,
                data: data.data.retrievedQueryUser,
            });
            localforage.setItem('userProfile', data.data.retrievedQueryUser);
        }
    } catch (error) {
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        }
    }
}

function* postRefreshToken(action) {
    const refreshToken = action.refreshToken;
    const url = '/token/refresh';
    try {
        yield put({
            type: REFRESH_TOKEN_INIT,
        });
        const data = yield call(api, 'post', url, { refreshToken });
        yield put({
            type: REFRESH_TOKEN_OK,
            data,
        });
        axios.defaults.headers.common = { Authorization: `Bearer ${data.token}` };
    } catch (error) {
        let data = null;
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = violationParser(error.response);
        }
        yield put({
            type: REFRESH_TOKEN_ERROR,
            data,
        });
    }
}

function* getCheckOnlineStatus() {
    const url = `${process.env.NEXT_PUBLIC_LOCAL_HOST}/icons/icon-48x48.png`;
    try {
        yield call(api, 'get', url, null, 'favicon', false);
        yield put({
            type: CHECK_ONLINE_STATUS_OK,
            isOnline: true,
        });
        // clears indexedDB offline event flag
        localforage.removeItem('offline-event-fired');
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
        yield put({
            type: CHECK_ONLINE_STATUS_ERROR,
            isOnline: !isOffline,
        });
    }
}

function* socialRegisterGoogle(action) {
    const url = '/users/social-register-google';
    const googleToken = action.token;
    try {
        yield put({
            type: SOCIAL_REGISTER_GOOGLE_INIT,
        });

        const data = yield call(api, 'post', url, { googleToken }, API_REST, false);
        yield put({
            type: SOCIAL_REGISTER_GOOGLE_OK,
            data,
        });
        // clears indexedDB offline event flag
        localforage.removeItem('offline-event-fired');
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = errorParser(error.response.data);
        }
        yield put({
            type: SOCIAL_REGISTER_GOOGLE_ERROR,
            data,
        });
    }
}

function* postAddress(action) {
    const { values } = action;
    const queryQl = `mutation postAddress(
            $address1: String!
            $address2: String!
            $address3: String
            $city: String!
            $postalCode: String!
            $lat: Float
            $lng: Float
        ) {
                createAddress(input:{
                address1: $address1
                address2: $address2
                address3: $address3
                city: $city
                postalCode: $postalCode
                lat: $lat
                lng: $lng
            }){
                address{
                    id
                }
            }
        }`;

    const variables = {
        address1: values.address1,
        address2: values.address2,
        address3: values.address3 || null,
        city: values.city,
        postalCode: values.postalCode,
        lat: values.lat,
        lng: values.lng,
    };

    try {
        yield put({
            type: POST_ADDRESS_INIT,
        });

        const data = yield call(
            apiQl,
            queryQl,
            variables,
        );
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_ADDRESS_ERROR,
                    data: errors,
                });
            }
        }
        yield put({
            type: POST_ADDRESS_OK,
            data: data.data.createAddress,
        });
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((data) => {
                if (data === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* putAddress(action) {
    const { values } = action;
    const queryQl = `mutation putAddress(
            $id: ID!,
            $address1: String!,
            $address2: String!,
            $address3: String,
            $city: String!,
            $postalCode: String!,
            $lat: Float,
            $lng: Float,
        ) {
                updateAddress(input:{
                id: $id,
                address1: $address1,
                address2: $address2,
                address3: $address3,
                city: $city,
                postalCode: $postalCode,
                lat: $lat,
                lng: $lng,
            }){
                address{
                    id
                }
            }
        }`;

    const variables = {
        id: values.id,
        address1: values.address1,
        address2: values.address2,
        address3: values.address3 || null,
        city: values.city,
        postalCode: values.postalCode,
        lat: values.lat,
        lng: values.lng,
    };

    try {
        yield put({
            type: PUT_ADDRESS_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = yield errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: PUT_ADDRESS_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: PUT_ADDRESS_OK,
                data: data.data.updateAddress,
            });
        }
    } catch (error) {
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((data) => {
                if (data === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* register(action) {
    // register kept as REST due to event issue with graphql
    // see https://github.com/api-platform/core/issues/3081
    const url = '/users';
    const { values } = action;
    const params = {
        email: values.email,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        username: values.username,
        address: values.address,
    };

    try {
        yield put({
            type: REGISTER_INIT,
        });

        const data = yield call(api, 'post', url, params, API_REST, false);
        yield put({
            type: REGISTER_OK,
            data,
        });
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = violationParser(error.response);
        }
        yield put({
            type: REGISTER_ERROR,
            data,
        });
    }
}

function* postUserConfirm(action) {
    const { token } = action;
    const url = '/users/confirm';
    try {
        yield put({
            type: POST_USER_CONFIRM_INIT,
        });

        const data = yield call(api, 'post', url, { confirmationToken: token }, API_REST, false);
        yield put({
            type: POST_USER_CONFIRM_OK,
            data,
        });
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = errorParser(error.response.data);
        }
        yield put({
            type: POST_USER_CONFIRM_ERROR,
            data,
        });
    }
}

function* postPasswordRecoveryRequest(action) {
    const emailRequest = action.emailRequest;
    const url = '/users/password-recovery';
    try {
        yield put({
            type: POST_PASSWORD_RECOVERY_REQUEST_INIT,
        });

        const data = yield call(api, 'post', url, { emailRequest }, API_REST, false);
        yield put({
            type: POST_PASSWORD_RECOVERY_REQUEST_OK,
            data,
        });
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = violationParser(error.response);
        }
        yield put({
            type: POST_PASSWORD_RECOVERY_REQUEST_ERROR,
            data,
        });
    }
}

function* postPasswordRecoveryReset(action) {
    const newPassword = action.values.newPassword;
    const newPasswordConfirmation = action.values.newPasswordConfirmation;
    const id = action.values.id;
    const url = `/users/${id}/password-recovery-reset`;
    try {
        yield put({
            type: POST_PASSWORD_RECOVERY_RESET_INIT,
        });

        const data = yield call(api, 'put', url, { newPassword, newPasswordConfirmation }, API_REST, false);
        yield put({
            type: POST_PASSWORD_RECOVERY_RESET_OK,
            data,
        });
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = violationParser(error.response);
        }
        yield put({
            type: POST_PASSWORD_RECOVERY_RESET_ERROR,
            data,
        });
    }
}

function* putRegisterSocial(action) {
    const { values } = action;
    const params = {
        username: values.username,
        address: values.address,
    };
    const url = `/users/${action.values.id}/register/social`;
    try {
        yield put({
            type: PUT_REGISTER_SOCIAL_INIT,
        });

        const data = yield call(api, 'put', url, params, API_REST, false);
        // if register social is ok, user will be registered AND logged in
        yield put({
            type: POST_LOGIN_OK,
            data,
        });
        axios.defaults.headers.common = {
            Authorization: `Bearer ${data.token}`,
        };
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = violationParser(error.response);
        }
        yield put({
            type: PUT_REGISTER_SOCIAL_ERROR,
            data,
        });
    }
}

function* postAd(action) {
    let mutation = 'createAd';
    if (!action.values.user) {
        mutation = 'withCustomArgsMutationAd';
    }
    const queryQl = `mutation postAd(
        $category: String!,
        $description: String!,
        $rentTime: Int,
        $budgetType: String,
        $budget: Int,
        ){
        ${mutation}(
            input:{
            category: $category,
            description: $description,
            rentTime: $rentTime,
            budgetType: $budgetType,
            budget: $budget
            }
        ) {
            ad{
                id
                _id
            }
        }
    }`;

    const variables = {
        description: action.values.description,
        budget: parseInt(action.values.budget, 10) || null,
        budgetType: action.values.budgetType || null,
        category: action.values.category,
        rentTime: parseInt(action.values.rentTime, 10) || null,
    };

    try {
        yield put({
            type: POST_AD_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_AD_ERROR,
                    data: errors,
                });
            }
        } else if (mutation === 'createAd') {
            yield put({
                type: POST_AD_OK,
                data: data.data.createAd,
            });
        } else if (mutation === 'withCustomArgsMutationAd') {
            yield put({
                type: POST_AD_OK,
                data: data.data.withCustomArgsMutationAd,
            });
        }
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* putUserToAd(action) {
    const queryQl = `mutation putUserToAd(
        $id: ID!,
        ){
            updateAd(
                input:{
                    id: $id,
                }
            ) {
                ad{
                    id
            }
        }
    }`;

    const variables = {
        id: `/api/ads/${action.values.ad}`,
    };

    try {
        yield put({
            type: PUT_USER_TO_AD_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: PUT_USER_TO_AD_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: PUT_USER_TO_AD_OK,
                data: data.data.updateAd,
            });
        }
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* putPasswordReset(action) {
    const values = {
        oldPassword: action.values.oldPassword,
        newPassword: action.values.newPassword,
        newPasswordConfirmation: action.values.newPasswordConfirmation,
    };
    const id = action.values.userId;
    const url = `/users/${id}/password-reset`;
    try {
        yield put({
            type: PUT_PASSWORD_RESET_INIT,
        });

        const data = yield call(
            api,
            'put',
            url,
            values,
            API_REST,
            false,
        );
        yield put({
            type: PUT_PASSWORD_RESET_OK,
            data,
        });
        axios.defaults.headers.common = {
            Authorization: `Bearer ${data.token}`,
        };
    } catch (error) {
        let data = null;
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = violationParser(error.response);
        }
        // TODO hanlde expired token
        yield put({
            type: PUT_PASSWORD_RESET_ERROR,
            data,
        });
    }
}

function* putUserProfile(action) {
    const queryQl = `mutation putUserProfile(
        $id: ID!
        $name: String
        $email: String
    ) {
        updateUser(
            input: {
                id: $id,
                name: $name,
                email: $email
            }
        ) {
            clientMutationId
        }
    }`;

    const variables = {
        id: `/api/users/${action.values.userId}`,
        name: action.values.name,
        email: action.values.email,
    };

    try {
        yield put({
            type: PUT_USER_PROFILE_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: PUT_USER_PROFILE_ERROR,
                    data: errors,
                });
            }
        } else {
            // set updated token if user own change
            if (data.data.updateUser.clientMutationId) {
                axios.defaults.headers.common = {
                    Authorization: `Bearer ${data.data.updateUser.clientMutationId}`,
                };
                yield put({
                    type: PUT_USER_PROFILE_OK_NEW_TOKEN,
                    data: data.data.updateUser.clientMutationId,
                });
            }
            yield put({
                type: PUT_USER_PROFILE_OK,
                data: data.data.updateUser,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* uploadUserImage(action) {
    const url = '/users/image';
    const file = action.file;
    try {
        yield put({
            type: UPLOAD_USER_IMAGE_INIT,
        });

        const data = yield call(api, 'post', url, file, API_REST, false);
        yield put({
            type: UPLOAD_USER_IMAGE_OK,
            data,
        });
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        let data = null;
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = errorParser(error.response.data);
        }
        yield put({
            type: UPLOAD_USER_IMAGE_ERROR,
            data,
        });
    }
}

function* getRecentAds() {
    const queryQl = `query recentAds {
    ads(
        isActive: true
        isDeleted: false
        first: 3
        after: null
        _order: {createdAt: "DESC"}
    ) {
        edges {
            node {
                id
                _id
                createdAt
                isActive
                isDeleted
                description
                rentTime
                budgetType
                budget
                user {
                    id
                    username
                    image {
                        filename
                    }
                    address {
                        city
                    }
                }
                category {
                    id
                    title
                    parent {
                        title
                    }
                    root {
                        title
                    }
                }
                budget
            }
        }
        totalCount
    }
}`;
    const variables = {};

    try {
        yield put({
            type: GET_RECENT_ADS_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_RECENT_ADS_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_RECENT_ADS_OK,
                data: data.data.ads,
            });
        }
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getAdsNext(action) {
    const queryQl = `query getAdsNext(
        $categoryId: String
        $categoryTitle: String
        $categoryParent: String
        $categoryParentTitle: String
        $categoryRootTitle: String
        $username: String
        $city: String
        $addressId: String
        $isActive: Boolean
        $isDeleted: Boolean
        $dateAfter: String
        $dateBefore: String
        $first: Int
        $after: String){
        ads(
            category: $categoryId
            category_title: $categoryTitle
            category_parent: $categoryParent
            category_parent_title: $categoryParentTitle
            category_root_title: $categoryRootTitle
            user_username: $username
            user_address: $addressId
            user_address_city: $city
            isActive: $isActive,
            isDeleted: $isDeleted
            first: $first,
            after: $after,
            _order:{createdAt: "DESC"}
            createdAt: {after: $dateAfter, before: $dateBefore}
            ) {
            totalCount
            pageInfo {
                startCursor
                endCursor
                hasNextPage
            }
            edges {
                cursor
                node {
                    id
                    _id
                    createdAt
                    description
                    budget
                    budgetType
                    rentTime
                    isActive
                    user {
                        id
                        username
                        image{
                            filename
                        }
                        address{
                            city
                        }
                    }
                    category {
                        id
                        title
                        parent{
                            title
                        }
                        root{
                            title
                        }
                    }
                }
            }
    }}`;
    const variables = {
        categoryId: action.values.categoryId || null,
        categoryTitle: action.values.categoryTitle || null,
        categoryParent: action.values.categoryParent || null,
        categoryParentTitle: action.values.categoryParentTitle || null,
        categoryRootTitle: action.values.categoryRootTitle || null,
        username: action.values.username || null,
        addressId: action.values.addressId || null,
        city: action.values.city || null,
        isActive: action.values.isActive || true,
        isDeleted: action.values.isDeleted || false,
        dateAfter: action.values.createdAt ? action.values.createdAt.after : null,
        dateBefore: action.values.createdAt ? action.values.createdAt.before : null,
        first: 10,
        after: action.values.cursor || null,
    };

    try {
        yield put({
            type: GET_ADS_NEXT_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_ADS_NEXT_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_ADS_NEXT_OK,
                data: data.data.ads,
            });
        }
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getAdsPrevious(action) {
    const queryQl = `query getAdsPrevious(
        $categoryId: String
        $categoryTitle: String
        $categoryParent: String
        $categoryParentTitle: String
        $categoryRootTitle: String
        $username: String
        $city: String
        $addressId: String
        $isActive: Boolean
        $isDeleted: Boolean
        $dateAfter: String
        $dateBefore: String
        $last: Int
        $before: String){
        ads(
            category: $categoryId
            category_title: $categoryTitle
            category_parent: $categoryParent
            category_parent_title: $categoryParentTitle
            category_root_title: $categoryRootTitle
            user_username: $username
            user_address: $addressId
            user_address_city: $city
            isActive: $isActive,
            isDeleted: $isDeleted
            last: $last
            before: $before
            _order:{createdAt: "DESC"}
            createdAt: {after: $dateAfter, before: $dateBefore}
            ) {
            totalCount
            pageInfo {
                startCursor
                endCursor
                hasNextPage
            }
            edges {
                cursor
                node {
                    id
                    _id
                    createdAt
                    description
                    budget
                    budgetType
                    rentTime
                    isActive
                    user {
                        id
                        username
                        image{
                            filename
                        }
                        address{
                            city
                        }
                    }
                    category {
                        id
                        title
                        parent{
                            title
                        }
                        root{
                            title
                        }
                    }
                }
            }
    }}`;
    const variables = {
        categoryId: action.values.categoryId,
        categoryTitle: action.values.categoryTitle,
        categoryParent: action.values.categoryParent,
        categoryParentTitle: action.values.categoryParentTitle,
        categoryRootTitle: action.values.categoryRootTitle,
        username: action.values.username,
        addressId: action.values.addressId,
        city: action.values.city,
        isActive: action.values.isActive,
        isDeleted: action.values.isDeleted,
        dateAfter: action.values.createdAt ? action.values.createdAt.after : null,
        dateBefore: action.values.createdAt ? action.values.createdAt.before : null,
        last: 10,
        before: action.values.cursor,
    };

    try {
        yield put({
            type: GET_ADS_PREVIOUS_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_ADS_PREVIOUS_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_ADS_PREVIOUS_OK,
                data: data.data.ads,
            });
        }
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getAd(action) {
    const queryQl = `query getAd($id: ID!, $isDeleted: Boolean){
        ad(id: $id) {
            id
            _id
            createdAt
            description
            budget
            budgetType
            rentTime
            isActive
            bids(
                isDeleted: $isDeleted
                _order: {message_sentAt: "DESC"}
            ){
                id
                isDeleted
                bidder{
                    _id
                    id
                    username
                }
                bidType
                bid
                message{
                    id
                    _id
                    subject
                    message
                    sentAt
                }
            }
            user {
                id
                username
                image{
                    filename
                }
                address{
                    city
                }
            }
            category {
                id
                title
                parent{
                    title
                }
                root{
                    title
                }
            }
        }
    }`;
    const variables = {
        id: `/api/ads/${action.id}`,
        isDeleted: false,
    };

    try {
        yield put({
            type: GET_AD_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_AD_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_AD_OK,
                data: data.data.ad,
            });
        }
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getMailbox(action) {
    const userId = `/api/users/${action.userId}`;
    const queryQl = `query getMailbox(
        $userId: ID!
        $isDeletedBySender: Boolean
        $isDeletedByReceiver: Boolean
        $senderIsEnabled: Boolean
        $receiverIsEnabled: Boolean
        ){
        retrievedQueryUser(
          id: $userId
        ){
            _id
            id
            username
            name
            email
            outbox(
              isDeletedBySender: $isDeletedBySender
              receiver_isEnabled: $receiverIsEnabled
              exists: {
                sender_deletedAt: false
              }
            ) {
                id
                _id
                sentAt
                isDeletedBySender
                isDeletedByReceiver
                readAt
                subject
                message
                attachments{
                  filename
                },
                receiver{
                    id
                    username
                    isEnabled
                    deletedAt
                }
            }
            inbox(
              isDeletedByReceiver: $isDeletedByReceiver
              sender_isEnabled: $senderIsEnabled
              exists: {
                sender_deletedAt: false
              }
            ){
                id
                _id
                sentAt
                isDeletedByReceiver
                isDeletedBySender
                isReported
                readAt
                subject
                message
                bid {
                    id
                }
                attachments{
                  filename
                }
                sender{
                    id
                    username
                    isEnabled
                    deletedAt
                }
                parent{
                    id
                }
                children{
                    id
                }
            }
        }
        collectionQueryMessages(
          exists: {
            children: true
            receiver_deletedAt: false
            sender_deletedAt: false
          }
          receiver_isEnabled: $receiverIsEnabled
        ){
            id
            _id
            sentAt
            message
            subject
            attachments{
                filename
            }
            sender{
                id
                username
                isEnabled
                deletedAt
            }
            receiver{
                id
                username
                isEnabled
                deletedAt
            }
            children{
                id
                _id
                sentAt
                message
                subject
                isDeletedBySender
                isDeletedByReceiver
                attachments{
                  filename
                }
                sender{
                    id
                    username
                }
                receiver{
                    id
                    username
                }
            }
        }
    }`;

    const variables = {
        userId,
        isDeletedBySender: false,
        isDeletedByReceiver: false,
        receiverIsEnabled: true,
        senderIsEnabled: true,
    };

    try {
        yield put({
            type: GET_MAILBOX_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_MAILBOX_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_MAILBOX_OK,
                data: data.data,
            });
            localforage.setItem('mailbox', data.data);
        }
    } catch (error) {
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        }
    }
}

function* postAttachments(action) {
    const url = '/attachments';
    const files = action.files;
    try {
        yield put({
            type: POST_ATTACHMENTS_INIT,
        });

        const data = yield call(api, 'post', url, files, API_REST, false);
        yield put({
            type: POST_ATTACHMENTS_OK,
            data: data['hydra:member'],
        });
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        let data = null;
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = errorParser(error.response.data);
        }
        yield put({
            type: POST_ATTACHMENTS_ERROR,
            data,
        });
    }
}

function* postMessage(action) {
    const { values } = action;
    const queryQl = `mutation postMessage(
        $subject: String!,
        $message: String!,
        $receiver: String!,
        $parent: String,
        $attachments: [String]
        ){
        createMessage(input:{
            subject: $subject,
            message: $message,
            receiver: $receiver,
            parent: $parent,
            attachments: $attachments
        })
        {
            message{
                id
                attachments{
                    id
                }
            }
        }
    }`;

    const variables = {
        subject: values.subject,
        message: values.message,
        receiver: values.receiver,
        parent: values.parent,
        attachments: values.attachments,
    };

    try {
        yield put({
            type: POST_MESSAGE_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_MESSAGE_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: POST_MESSAGE_OK,
                data: data.data.createMessage,
            });
        }
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* putMessageUpdateStatus(action) {
    const queryQl = `mutation putMessageUpdateStatus(
        $id: ID!,
        $readAt: String
        $isDeletedBySender: Boolean!
        $isDeletedByReceiver: Boolean!
        $isReported: Boolean!
        ){
        updateMessage(
            input: {
                id: $id,
                readAt: $readAt
                isDeletedBySender: $isDeletedBySender
                isDeletedByReceiver: $isDeletedByReceiver
                isReported: $isReported
            }
        ){
            message{
                id
                readAt
                isDeletedBySender
                isDeletedByReceiver
                isReported
            }
        }
    }`;

    const variables = {
        id: `/api/messages/${action.values.id}`,
        readAt: action.values.readAt,
        isDeletedBySender: action.values.isDeletedBySender,
        isDeletedByReceiver: action.values.isDeletedByReceiver,
        isReported: action.values.isReported,
    };

    try {
        yield put({
            type: PUT_MESSAGE_UPDATE_STATUS_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: PUT_MESSAGE_UPDATE_STATUS_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: PUT_MESSAGE_UPDATE_STATUS_OK,
                data: data.data.updateMessage,
            });
        }
    } catch (error) {
        const isOffline = !!(error.response === undefined || error.code === 'ECONNABORTED');
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* postMessageForBid(action) {
    const { values } = action;
    const queryQl = `mutation postMessageForBid(
        $receiver: String!
        $subject: String!
        $message: String!
        ){withCustomArgsMutationMessage(input:{
            receiver: $receiver
            subject: $subject
            message: $message
        }){
            clientMutationId
            message{
                id
                attachments{
                    id
                }
            }
        }
    }`;

    const variables = {
        receiver: values.receiver,
        subject: values.subject,
        message: values.message,
    };

    try {
        yield put({
            type: POST_MESSAGE_FOR_BID_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_MESSAGE_FOR_BID_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: POST_MESSAGE_FOR_BID_OK,
                data: data.data.withCustomArgsMutationMessage,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* postBlockUser(action) {
    const queryQl = `mutation postBlockedUser(
        $blocked: String!,
    ){
        createBlockedUser(
            input:{
                blocked: $blocked,
            }
        ) {
            blockedUser{
                id
                blocker{
                    username
                }
                blocked{
                    username
                }
            }
        }
    }`;

    const variables = {
        blocked: action.userId,
    };

    try {
        yield put({
            type: POST_BLOCK_USER_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_BLOCK_USER_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: POST_BLOCK_USER_OK,
                data: data.data.createBlockedUser,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* deleteBlockedUser(action) {
    const queryQl = `mutation deleteBlockedUser(
        $id: ID!,
        ){
            deleteBlockedUser(
                input:{
                    id: $id
                }
            ){
                clientMutationId
            }
        }`;
    const variables = {
        id: action.blockedId,
    };

    try {
        yield put({
            type: DELETE_BLOCKED_USER_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: DELETE_BLOCKED_USER_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: DELETE_BLOCKED_USER_OK,
                data: data.data.deleteBlockedUser,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* postBid(action) {
    const queryQl = `mutation createBid(
        $ad: String!
        $bid: Int!
        $message: [String]
    ){ createBid(
        input: {
            ad: $ad,
            bid: $bid,
            message: $message
        }
    ){
        bid{
            id
        }
    }
}`;

    const variables = {
        ad: action.values.ad,
        bid: action.values.bid,
        message: action.values.messageId,
    };

    try {
        yield put({
            type: POST_BID_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_BID_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: POST_BID_OK,
                data: data.data.createBid,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* putAd(action) {
    const queryQl = `mutation updateAd(
        $id: ID!,
        $description: String,
        $rentTime: Int,
        $budgetType: String,
        $budget: Int
    ){
        updateAd(
            input:{
                id: $id,
                description: $description,
                rentTime: $rentTime,
                budgetType: $budgetType,
                budget: $budget
            }
        ){
            ad{
                id
                _id
                createdAt
                isActive
                isDeleted
                description
                rentTime
                budgetType
                budget
            }
        }
    }`;

    const variables = {
        id: action.values.id,
        description: action.values.description,
        rentTime: action.values.rentTime,
        budgetType: action.values.budgetType,
        budget: action.values.budget,
    };

    try {
        yield put({
            type: PUT_AD_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: PUT_AD_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: PUT_AD_OK,
                data: data.data.updateAd,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* deleteAd(action) {
    const queryQl = `mutation deleteAd(
        $id: ID!,
        $isDeleted: Boolean,
        $isActive: Boolean,
        $clientMutationId: String
        ){
            updateAd(
                input: {
                    id: $id
                    isDeleted: $isDeleted,
                    isActive: $isActive,
                    clientMutationId: $clientMutationId
                }
        ){
            clientMutationId
        }
    }`;

    const variables = {
        id: action.adId,
        isDeleted: true,
        isActive: false,
        clientMutationId: action.adId,
    };

    try {
        yield put({
            type: DELETE_AD_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: DELETE_AD_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: DELETE_AD_OK,
                data: data.data.updateAd,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* toggleActiveAd(action) {
    const queryQl = `mutation updateAd(
        $id: ID!,
        $isActive: Boolean,
    ){
        updateAd(
            input:{
                id: $id,
                isActive: $isActive,
            }
        ){
            ad{
                id
                _id
                createdAt
                isActive
                isDeleted
                description
                rentTime
                budgetType
                budget
                user {
                    id
                    username
                    image {
                        filename
                    }
                    address {
                        city
                    }
                }
                category {
                    id
                    title
                    parent {
                        title
                    }
                    root {
                        title
                    }
                }
            }
        }
    }`;

    const variables = {
        id: action.values.id,
        isActive: !action.values.isActive,
    };

    try {
        yield put({
            type: TOGGLE_ACTIVE_AD_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: TOGGLE_ACTIVE_AD_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: TOGGLE_ACTIVE_AD_OK,
                data: data.data.updateAd,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* deleteBid(action) {
    const { bidId } = action;
    const queryQl = `mutation updateBid(
        $bidId: ID!
        $isDeleted: Boolean) {
            updateBid(input:{
                id: $bidId
                isDeleted: $isDeleted
            }){
            bid{
                id
            }
        }
    }`;

    const variables = {
        bidId,
        isDeleted: true,
    };

    try {
        yield put({
            type: DELETE_BID_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: DELETE_BID_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: DELETE_BID_OK,
                data: data.data.updateBid,
            });
        }
    } catch (error) {
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (
            error.response === undefined ||
            error.code === 'ECONNABORTED'
        ) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getUsersNext(action) {
    const queryQl = `query getUsersNext(
            $first: Int,
            $after: String) {
        users(
            first: $first,
            after: $after
            _order: {createdAt: "DESC"}
            ) {
            edges{
                node{
                    id
                    _id
                    name
                    username
                    email
                    createdAt
                    isEnabled
                    deletedAt
                    roles
                    address{
                        id
                        address1
                        address2
                        address3
                        city
                        postalCode
                    }
                    blockedUsers{
                        id
                        blocker{
                            username
                        }
                        blocked{
                            username
                        }
                    }
                }
            }
            pageInfo{
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
            totalCount
        }
    }`;

    const variables = {
        first: 10,
        after: action.values.cursor,
    };

    try {
        yield put({
            type: GET_USERS_NEXT_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_USERS_NEXT_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_USERS_NEXT_OK,
                data: data.data,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}


function* getUsersPrevious(action) {
    const queryQl = `query getUsersPrevious(
            $last: Int,
            $before: String) {
        users(
            last: $last,
            before: $before
            _order: {createdAt: "DESC"}
            ) {
            edges{
                node{
                    id
                    _id
                    name
                    username
                    email
                    createdAt
                    isEnabled
                    deletedAt
                    roles
                    address{
                        id
                        address1
                        address2
                        address3
                        city
                        postalCode
                    }
                    blockedUsers{
                        id
                        blocker{
                            username
                        }
                        blocked{
                            username
                        }
                    }
                }
            }
            pageInfo{
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
            totalCount
        }
    }`;

    const variables = {
        last: 10,
        before: action.values.cursor,
    };

    try {
        yield put({
            type: GET_USERS_PREVIOUS_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_USERS_PREVIOUS_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_USERS_PREVIOUS_OK,
                data: data.data,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* toggleUserStatus(action) {
    const queryQl = `mutation toggleUserStatus(
            $id: ID!
            $action: String!
            $clientMutationId: String!
            ) {
        withCustomArgsMutationUser(input:{
            id: $id
            action: $action
            clientMutationId: $clientMutationId
        }) {
            clientMutationId
        }
    }`;

    const variables = {
        id: action.values.userId,
        action: action.values.action,
        clientMutationId: action.values.userId,
    };

    try {
        yield put({
            type: TOGGLE_USER_STATUS_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: TOGGLE_USER_STATUS_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: TOGGLE_USER_STATUS_OK,
                data: data.data,
            });
            localforage.removeItem('users');
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getUserAdsNext(action) {
    const queryQl = `
        query getUserAdsNext(
            $userId: ID!
            $isActive: Boolean
            $isDeleted: Boolean
            $isDeletedBid: Boolean
            $first: Int,
            $after: String) {
            user(id: $userId) {
                ads(
                    first: $first,
                    after: $after,
                    isActive: $isActive,
                    isDeleted: $isDeleted
                    _order: {createdAt: "DESC"}
                ){
                    totalCount
                    pageInfo {
                        startCursor
                        endCursor
                        hasNextPage
                    }
                    edges{
                        node{
                            _id
                            id
                            description
                            createdAt
                            isActive
                            isDeleted
                            category{
                                _id
                                id
                                title
                            }
                            bids(isDeleted: $isDeletedBid){
                                id
                            }
                        }
                    }
                }
            }
        }`;

    const variables = {
        userId: action.values.userId,
        isActive: true,
        isDelete: false,
        first: 10,
        after: action.values.cursor,
        isDeletedBid: false,
    };

    try {
        yield put({
            type: GET_USER_ADS_NEXT_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_USER_ADS_NEXT_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_USER_ADS_NEXT_OK,
                data: data.data,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getUserAdsPrevious(action) {
    const queryQl = `
        query getUserAdsPrevious(
            $userId: ID!
            $isActive: Boolean
            $isDeleted: Boolean
            $isDeletedBid: Boolean
            $last: Int,
            $before: String) {
            user(id: $userId) {
                ads(
                    last: $last,
                    before: $before,
                    isActive: $isActive,
                    isDeleted: $isDeleted
                    _order: {createdAt: "DESC"}
                ){
                    totalCount
                    pageInfo {
                        startCursor
                        endCursor
                        hasNextPage
                    }
                    edges{
                        node{
                            _id
                            id
                            description
                            createdAt
                            isActive
                            isDeleted
                            category{
                                _id
                                id
                                title
                            }
                            bids(isDeleted: $isDeletedBid){
                                id
                            }
                        }
                    }
                }
            }
        }`;

    const variables = {
        userId: action.values.userId,
        isActive: true,
        isDeleted: false,
        last: 10,
        before: action.values.cursor,
        isDeletedBid: false,
    };

    try {
        yield put({
            type: GET_USER_ADS_PREVIOUS_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_USER_ADS_PREVIOUS_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_USER_ADS_PREVIOUS_OK,
                data: data.data,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getUser(action) {
    const queryQl = `query getUser(
        $id: ID!
    ) {
        withCustomArgsQueryUser(
            id: $id
        ) {
            id
            _id
            name
            username
            email
            createdAt
            isEnabled
            deletedAt
            roles
            address{
                id
                address1
                address2
                address3
                city
                postalCode
            }
            blockedUsers{
                id
                blocker{
                    username
                }
                blocked{
                    username
                }
            }
        }
    }`;

    const variables = {
        id: action.userId,
    };

    try {
        yield put({
            type: GET_USER_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_USER_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_USER_OK,
                data: data.data.withCustomArgsQueryUser,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getCategories() {
    const queryQl = `query getCategories {
        categories(
            _order: {title: "ASC"}
        ){
            id
            title
            parent{
                title
            }
            root{
                title
            }
            ads{
              totalCount
            }
        }
    }`;

    try {
        yield put({
            type: GET_CATEGORIES_INIT,
        });

        const data = yield call(apiQl, queryQl);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_CATEGORIES_ERROR,
                    data: errors,
                });
            }
        }
        yield put({
            type: GET_CATEGORIES_OK,
            data: data.data,
        });
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((data) => {
                if (data === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* postCategory(action) {
    const { values } = action;
    const queryQl = `mutation postCategory(
        $title: String!
        $parent: String
    ) {
        createCategory(input:{
        title: $title
        parent: $parent
        }){
            clientMutationId
            category{
                id
                title
                parent{
                    title
                }
                root{
                    title
                }
            }
        }
    }`;

    const variables = {
        title: values.title,
        parent: values.parent,
    };

    try {
        yield put({
            type: POST_CATEGORY_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_CATEGORY_ERROR,
                    data: errors,
                });
            }
        }
        yield put({
            type: POST_CATEGORY_OK,
            data: data.data.createCategory,
        });
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((data) => {
                if (data === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* deleteCategory(action) {
    const queryQl = `mutation deleteCategory(
        $id: ID!
    ){
        deleteCategory(
            input: {
                id: $id
            }
        ){
            clientMutationId
        }
    }`;

    const variables = {
        id: action.catId,
    };

    try {
        yield put({
            type: DELETE_CATEGORY_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: DELETE_CATEGORY_ERROR,
                    data: errors,
                });
            }
        }
        yield put({
            type: DELETE_CATEGORY_OK,
            data: data.data.createCategory,
        });
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((data) => {
                if (data === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* putCategory(action) {
    const queryQl = `mutation putCategory(
        $id: ID!
        $title: String
    ){
        updateCategory(input:{
            id: $id
            title: $title
        }){
            clientMutationId
        }
    }`;

    const variables = {
        id: action.values.id,
        title: action.values.title,
    };

    try {
        yield put({
            type: PUT_CATEGORY_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: PUT_CATEGORY_ERROR,
                    data: errors,
                });
            }
        }
        yield put({
            type: PUT_CATEGORY_OK,
            data: data.data.updateCategory,
        });
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((data) => {
                if (data === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getUsersAll(action) {
    const queryQl = `query getUsersAll(
            $first: Int,
            $after: String) {
        users(
            first: $first,
            after: $after
            _order: {username: "ASC"}
            ) {
            edges{
                node{
                    id
                    _id
                    username
                }
            }
            totalCount
        }
    }`;

    const variables = {
        first: action.values.totalCount,
        after: null,
    };

    try {
        yield put({
            type: GET_USERS_ALL_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_USERS_ALL_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_USERS_ALL_OK,
                data: data.data,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getChartsDataInit(action) {
    const url = '/groupby';
    try {
        yield put({
            type: GET_CHARTS_DATA_INIT_INIT,
        });
        const data = yield call(apiStd, url, action.values);
        yield put({
            type: GET_CHARTS_DATA_INIT_OK,
            data,
        });
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = [
                {
                    message: error.response.data.message,
                },
            ];
        }
        yield put({
            type: GET_CHARTS_DATA_INIT_ERROR,
            data,
        });
    }
}

function* getAdsGroupByCategory(action) {
    const url = '/groupby';
    try {
        yield put({
            type: GET_ADS_GROUPBY_CATEGORY_INIT,
        });
        const data = yield call(apiStd, url, action.values);
        yield put({
            type: GET_ADS_GROUPBY_CATEGORY_OK,
            data,
        });
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        } else {
            data = [
                {
                    message: error.response.data.message,
                },
            ];
        }
        yield put({
            type: GET_ADS_GROUPBY_CATEGORY_ERROR,
            data,
        });
    }
}

function* postUserAsProvider(action) {
    const { values } = action;
    const queryQl = `mutation postProvider(
        $businessName: String
        $providedCategories: [String]
    ){
        createUserAsProvider(input: {
            businessName: $businessName
            providedCategories: $providedCategories
        }){
            userAsProvider{
                id
            }
        }
    }`;

    const variables = {
        businessName: values.businessName || null,
        providedCategories: values.providedCategories,
    };

    try {
        yield put({
            type: POST_USER_AS_PROVIDER_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: POST_USER_AS_PROVIDER_ERROR,
                    data: errors,
                });
            }
        }
        yield put({
            type: POST_USER_AS_PROVIDER_OK,
            data: data.data.createUserAsProvider,
        });
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((data) => {
                if (data === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

/* GRAPHQL try-out version
function* getAdsGroupByCategory(action) {
    const queryQl = `query getAdsGroupByCategory{
        last1: ads(
            category_parent_id: 6144
            createdAt: {after: "2020/04/01", strictly_before: "2020/05/01"}
        ) {
            totalCount
            edges{
                node{
                    category{
                        parent{
                            id
                        }
                    }
                }
            }
        }
        last2: ads(
            category_parent_id: 6144
            createdAt: {after: "2020/03/01", strictly_before: "2020/04/01"}
        ) {
            totalCount
        }
        last3: ads(
            category_parent_id: 6144
            createdAt: {after: "2020/02/01", strictly_before: "2020/03/01"}
        ) {
            totalCount
        }
        last4: ads(
            category_parent_id: 6144
            createdAt: {after: "2020/01/01", strictly_before: "2020/02/01"}
        ) {
            totalCount
        }
        last5: ads(
            category_parent_id: 6144
            createdAt: {after: "2019/12/01", strictly_before: "2020/01/01"}
        ) {
            totalCount
        }
        last6: ads(
            category_parent_id: 6144
            createdAt: {after: "2019/11/01", strictly_before: "2019/12/01"}
        ) {
            totalCount
        }
    }`;

    const variables = {
        first: action.values.totalCount,
        after: null,
    };

    try {
        yield put({
            type: GET_ADS_GROUPBY_CATEGORY_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            const errors = errorParserGraphql(data.errors);
            if (errors === 'token expired') {
                yield put({
                    type: LOGOUT_TOKEN_EXPIRED,
                });
            } else {
                yield put({
                    type: GET_ADS_GROUPBY_CATEGORY_ERROR,
                    data: errors,
                });
            }
        } else {
            yield put({
                type: GET_ADS_GROUPBY_CATEGORY_OK,
                data: data.data,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}
*/

export default function* () {
    yield all([
        takeLatest(POST_LOGIN, postLogin),
        takeLatest(POST_SOCIAL_LOGIN_GOOGLE, postSocialLoginGoogle),
        takeLatest(GET_USER_PROFILE, getUserProfile),
        takeLatest(PUT_USER_PROFILE, putUserProfile),
        takeLatest(REFRESH_TOKEN, postRefreshToken),
        takeLatest(CHECK_ONLINE_STATUS, getCheckOnlineStatus),
        takeLatest(SOCIAL_REGISTER_GOOGLE, socialRegisterGoogle),
        takeLatest(POST_ADDRESS, postAddress),
        takeLatest(PUT_ADDRESS, putAddress),
        takeLatest(REGISTER, register),
        takeLatest(POST_USER_CONFIRM, postUserConfirm),
        takeLatest(POST_PASSWORD_RECOVERY_REQUEST, postPasswordRecoveryRequest),
        takeLatest(POST_PASSWORD_RECOVERY_RESET, postPasswordRecoveryReset),
        takeLatest(PUT_PASSWORD_RESET, putPasswordReset),
        takeLatest(PUT_REGISTER_SOCIAL, putRegisterSocial),
        takeLatest(POST_AD, postAd),
        takeLatest(PUT_USER_TO_AD, putUserToAd),
        takeLatest(UPLOAD_USER_IMAGE, uploadUserImage),
        takeLatest(GET_RECENT_ADS, getRecentAds),
        takeLatest(GET_ADS_NEXT, getAdsNext),
        takeLatest(GET_ADS_PREVIOUS, getAdsPrevious),
        takeLatest(GET_AD, getAd),
        takeLatest(GET_MAILBOX, getMailbox),
        takeLatest(POST_ATTACHMENTS, postAttachments),
        takeLatest(POST_MESSAGE, postMessage),
        takeLatest(POST_MESSAGE_FOR_BID, postMessageForBid),
        takeLatest(PUT_MESSAGE_UPDATE_STATUS, putMessageUpdateStatus),
        takeLatest(POST_BLOCK_USER, postBlockUser),
        takeLatest(DELETE_BLOCKED_USER, deleteBlockedUser),
        takeLatest(POST_BID, postBid),
        takeLatest(PUT_AD, putAd),
        takeLatest(DELETE_AD, deleteAd),
        takeLatest(TOGGLE_ACTIVE_AD, toggleActiveAd),
        takeLatest(DELETE_BID, deleteBid),
        takeLatest(GET_USERS_NEXT, getUsersNext),
        takeLatest(GET_USERS_PREVIOUS, getUsersPrevious),
        takeLatest(TOGGLE_USER_STATUS, toggleUserStatus),
        takeLatest(GET_USER_ADS_NEXT, getUserAdsNext),
        takeLatest(GET_USER_ADS_PREVIOUS, getUserAdsPrevious),
        takeLatest(GET_USER, getUser),
        takeLatest(GET_CATEGORIES, getCategories),
        takeLatest(POST_CATEGORY, postCategory),
        takeLatest(DELETE_CATEGORY, deleteCategory),
        takeLatest(PUT_CATEGORY, putCategory),
        takeLatest(GET_USERS_ALL, getUsersAll),
        takeLatest(GET_CHARTS_DATA_INIT, getChartsDataInit),
        takeLatest(GET_ADS_GROUPBY_CATEGORY, getAdsGroupByCategory),
        takeLatest(POST_USER_AS_PROVIDER, postUserAsProvider),
    ]);
}

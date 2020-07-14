/* eslint-disable import/prefer-default-export */
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createWrapper } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootReducer from './reducers/index';
import sagas from './sagas';

const bindMiddleware = (middleware) => {
    const arrMiddleware = [middleware];
    if (process.env.NODE_ENV !== 'production') {
        return composeWithDevTools(applyMiddleware(...arrMiddleware));
    }
    return applyMiddleware(...arrMiddleware);
};

const configureStore = ({req = null}) => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        rootReducer,
        bindMiddleware(sagaMiddleware),
    );
    const isServer = typeof window === 'undefined';
    if (req || !isServer) {
        store.sagaTask = sagaMiddleware.run(sagas);
    }
    return store;
}

// export default configureStore;
export default createWrapper(configureStore, { debug: false });
// export default wrapper;
// https://github.com/vercel/next.js/tree/canary/examples/with-redux-saga
// https://github.com/bmealhouse/next-redux-saga
// https://www.robinwieruch.de/nextjs-redux-saga
// https://codesandbox.io/s/y16j84949?file=/pages/_app.js:0-784

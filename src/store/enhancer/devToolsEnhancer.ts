import {compose, StoreEnhancer} from 'redux';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
        __REDUX_DEVTOOLS_EXTENSION__?: (options?: any) => StoreEnhancer<any>;
    }
}

/**
 * Redux DevTools Composer. Compatible with other enhancers and middlewares.
 * @example
 * const enhancers = composeEnhancers(applyMiddleware(serviceCallMiddleware))
 * export const store = createStore(storeReducer, enhancers);
 */
export const composeEnhancers: typeof compose =
    process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

/**
 * Redux DevTools Enhancer. Use in case you don't include other enhancers and middlewares
 * @example
 * export const store = createStore(storeReducer, devToolsEnhancer());
 */
export const devToolsEnhancer: (options?: any) => StoreEnhancer<any> =
    process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__
        : () => (noop: any) => noop;

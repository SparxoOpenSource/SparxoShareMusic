import { combineReducers } from 'redux'
import location from './location'
import i18n from './i18n'
import session from './session'

export const makeRootReducer = (asyncReducers?: any) => {
    var reducers = {
        location,
        i18n,
        session
    };
    for (var key in asyncReducers) {
        reducers[key] = asyncReducers[key];
    }
    return combineReducers(reducers);
}
export const injectReducer = (store, { key, reducer }) => {
    store.asyncReducers[key] = reducer
    store.replaceReducer(makeRootReducer(store.asyncReducers))
}

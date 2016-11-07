import { injectReducer } from '../../store/reducers'
import  HomeContainer  from './containers/HomeContainer'
import  homeReducer from './modules/home'


export default (store) => {
    injectReducer(store, { key: "home", reducer: homeReducer })
    return {
        path: 'home',
        onEnter: (nextState, replace) => {
            var session = store.getState().session;
            if (!session['user']) {
                replace('/login');
            }
        },
        component: HomeContainer
    }
}

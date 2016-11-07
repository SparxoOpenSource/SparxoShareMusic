import { injectReducer } from '../../store/reducers'
import LoginContainer from './containers/LoginContainer'

export default (store) => {
    return {
        path: 'login',
        component: LoginContainer
    }
}

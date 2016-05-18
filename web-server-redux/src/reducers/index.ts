import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

import player from './player';
import session from './session';

const rootReducer = combineReducers({
  routing: routerReducer,
  form:formReducer,
  player,
  session
});

export default rootReducer;

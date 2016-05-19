import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

import player from './player';
import session from './session';
import add from './add';

const rootReducer = combineReducers({
  routing: routerReducer,
  form:formReducer,
  player,
  session,
  add
});

export default rootReducer;

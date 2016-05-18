import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import player from './player';

const rootReducer = combineReducers({
  routing: routerReducer,
  player
});

export default rootReducer;

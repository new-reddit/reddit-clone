import { combineReducers } from 'redux';
import user from './user';
import alert from './alert';

const rootReducer = combineReducers({
  user,
  alert,
});

export default rootReducer;

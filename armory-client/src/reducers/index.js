import {combineReducers} from 'redux';
import {contestList, contestMap} from './contest';
import auth from "./auth";

export default combineReducers({
  contestList,
  contestMap,
  user: auth
})

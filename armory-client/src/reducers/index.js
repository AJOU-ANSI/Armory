import {combineReducers} from 'redux';
import {contestList, contestMap} from './contest';
import auth from "./auth";
import {socket} from './socket';

export default combineReducers({
  contestList,
  contestMap,
  user: auth,
  socket
})

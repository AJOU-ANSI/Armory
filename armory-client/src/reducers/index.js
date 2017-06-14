import {combineReducers} from 'redux';
import {contestList, contestMap} from './contest';
import auth from "./auth";
import {socket} from './socket';
import {problemList, problemMap} from './problem';

export default combineReducers({
  contestList,
  contestMap,
  user: auth,
  socket,
  problemList,
  problemMap
})

import {combineReducers} from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';

import {contestList, contestMap, userContestInfo} from './contest';
import auth from "./auth";
import {socket} from './socket';
import {problemList, problemMap} from './problem';

export default combineReducers({
  contestList,
  contestMap,
  user: auth,
  socket,
  problemList,
  problemMap,
  toastr: toastrReducer,
  userContestInfo
})

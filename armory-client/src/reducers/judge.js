import {handleActions} from 'redux-actions';

import {getJudgeMap, updateJudgeMap} from '../actions/judge';

export default handleActions({
  [getJudgeMap]: function (state, action) {
    if (action.error) {
      return state;
    }

    return action.payload;
  },
  [updateJudgeMap]: function (state, action) {
    if (action.error) {
      return state;
    }

    return action.payload;
  }
}, {});

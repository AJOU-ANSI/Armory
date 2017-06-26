import {handleActions} from 'redux-actions';
import {getContestByName, getContestList, getUserContestInfo} from '../actions/contest';

export const contestList = handleActions({
  [getContestList]: function (state, action) {
    if (action.error) {
      return state;
    }

    return action.payload;
  }
}, null);

export const contestMap = handleActions({
  [getContestByName]: function (state, action) {
    if (action.error) {
      return state;
    }

    const {contest, contestName} = action.payload;

    return Object.assign({}, state, {
      [contestName]: contest !== null ? contest : {empty: true}
    });
  }
}, {});

export const userContestInfo = handleActions({
  [getUserContestInfo]: function (state, action) {
    if (action.error) {
      return state;
    }
    
    return action.payload;
  }
}, {});

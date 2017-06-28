import {handleActions} from 'redux-actions';
import {getProblemByCode, getProblemList, getProblemStatuses} from '../actions/problem';

export const problemList = handleActions({
  [getProblemList]: (state, action) => {
    if (!action.error) {
      return action.payload;
    }

    return state;
  }
}, null);

export const problemMap = handleActions({
  [getProblemByCode]: (state, action) => {
    if (!action.error) {
      const problem = action.payload;

      return Object.assign({}, state, {[problem.code]: problem});
    }

    return state;
  }
}, {})

export const problemStatuses = handleActions({
  [getProblemStatuses]: (state, action) => {
    if (!action.error) {
      return action.payload;
    }

    return state;
  }
}, null)

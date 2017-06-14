import {handleActions} from 'redux-actions';
import {closeWebSocket, connectWebSocket} from '../actions/socket';

export const socket = handleActions({
  [connectWebSocket]: function (state, action) {
    if (!action.error) {
      return action.payload;
    }

    return state;
  },
  [closeWebSocket]: function (state, action) {
    return null;
  }
}, null);

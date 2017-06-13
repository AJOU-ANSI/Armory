import {handleActions} from 'redux-actions';
import {connectWebSocket} from '../actions/socket';

export const socket = handleActions({
  [connectWebSocket]: function (state, action) {
    if (!action.error) {
      return action.payload;
    }
    
    return state;
  }
}, null);

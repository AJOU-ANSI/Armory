import {handleActions} from 'redux-actions';
import {login, loggedIn, logout} from '../actions/auth';
import type {User} from '../types/MyTypes';

type AuthAction = {
  payload: User,
  type: string,
  error?: boolean
};

const initialState: User = null;

export default handleActions({
  // [signup]: function(state: User, action: AuthAction): User {
  //   if( action.error ) {
  //     return state;
  //   }
  //
  //   return action.payload;
  // }
  [login]: function(state: User, action: AuthAction): User {
    if( action.error ) {
      return state;
    }

    return Object.assign({}, action.payload, {isAuth: true, login: true});
  },
  [loggedIn]: function(state: User, action: AuthAction): User {
    if( action.error ) {
      return state;
    }

    if( !action.payload ) {
      return {};
    }

    return Object.assign({}, action.payload, {isAuth: true});
  },
  [logout]: function(state: User, action: AuthAction): User {
    if( action.error ) {
      return state;
    }

    return {};
  }
}, initialState);

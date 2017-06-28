// @flow

import {createAction} from 'redux-actions';
import {toastr} from 'react-redux-toastr';
import {fetchGetUserContestInfo, getUserContestInfo} from './contest';

// export const signup = createAction('SIGNUP');
export const login = createAction('LOGIN');
export const loggedIn = createAction('LOGGED_IN');
export const logout = createAction('LOGOUT');

// const signupUrl = '/auth/signup';
const loginUrl = (contestName) => (`/auth/${contestName}/login`);
const loggedInUrl = (contestName) => (`/auth/${contestName}/loggedin`);
const logoutUrl = (contestName) => (`/auth/${contestName}/logout`);

export const fetchLogin = (contestName, data) => {
  return async (dispatch) => {
    const resp = await fetch(loginUrl(contestName), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include'
    });

    if(!resp.ok) {
      let body;

      try {
        body = await resp.json();
      }
      catch(e) {
        let message  = await resp.text();

        body = {message};
      }

      toastr.warning("시스템 메세지",  body.message);

      return dispatch(login(new Error(body.message)));
    }

    const {result: {user}} = await resp.json();

    toastr.success("시스템 메세지", "로그인이 완료되었습니다.");

    dispatch(fetchGetUserContestInfo(contestName, user));

    return dispatch(login(user));
  };
};

export const fetchLoggedIn = (contestName) => {
  return async (dispatch) => {
    const resp = await fetch(loggedInUrl(contestName), {credentials: 'include'});

    if(!resp.ok) {
      const body = await resp.json();

      return dispatch(loggedIn(new Error(body.message)));
    }

    const {result: {user}} = await resp.json();

    dispatch(fetchGetUserContestInfo(contestName, user));

    return dispatch(loggedIn(user));
  }
};

export const fetchLogout = (contestName) => {
  return async (dispatch, getState) => {
    const {socket} = getState();

    if (socket) socket.emit('logout');

    const resp = await fetch(logoutUrl(contestName), {method: 'POST', credentials: 'include'});

    if(!resp.ok) {
      const body = await resp.json();

      return dispatch(loggedIn(new Error(body.message)));
    }

    dispatch(getUserContestInfo({}));

    toastr.success('시스템 메세지', '로그아웃이 완료되었습니다.');

    return dispatch(logout({}));
  }
}

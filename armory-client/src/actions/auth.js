// @flow

import {createAction} from 'redux-actions';
import {toastr} from 'react-redux-toastr';
import {fetchGetUserContestInfo} from './contest';

// export const signup = createAction('SIGNUP');
export const login = createAction('LOGIN');
export const loggedIn = createAction('LOGGED_IN');
export const logout = createAction('LOGOUT');

// const signupUrl = '/auth/signup';
const loginUrl = (contestName) => (`/auth/${contestName}/login`);
const loggedInUrl = (contestName) => (`/auth/${contestName}/loggedin`);
const logoutUrl = (contestName) => (`/auth/${contestName}/logout`);

// export const fetchSignup = (data: SignupUser) => {
//   return async (dispatch: Function) => {
//     const resp = await fetch(signupUrl, {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       method: 'POST',
//       body: JSON.stringify(data)
//     });
//
//     if(!resp.ok) {
//       const body: authFailResponse = await resp.json();
//
//       return dispatch(signup(new Error(body.msg)));
//     }
//
//     const body: authResponse = await resp.json();
//
//     return dispatch(signup(body.result.user));
//   };
// };
//
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

    const body = await resp.json();

    toastr.success("시스템 메세지", "로그인이 완료되었습니다.");

    dispatch(fetchGetUserContestInfo(contestName));

    return dispatch(login(body.result.user));
  };
};

export const fetchLoggedIn = (contestName) => {
  return async (dispatch) => {
    const resp = await fetch(loggedInUrl(contestName), {credentials: 'include'});

    if(!resp.ok) {
      const body = await resp.json();

      return dispatch(loggedIn(new Error(body.message)));
    }

    const body = await resp.json();

    dispatch(fetchGetUserContestInfo(contestName));

    return dispatch(loggedIn(body.result.user));
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

    toastr.success('시스템 메세지', '로그아웃이 완료되었습니다.');

    return dispatch(logout({}));
  }
}

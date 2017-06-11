// @flow

import {createAction} from 'redux-actions';

// export const signup = createAction('SIGNUP');
export const login = createAction('LOGIN');
export const loggedIn = createAction('LOGGED_IN');
export const logout = createAction('LOGOUT');

// const signupUrl = '/auth/signup';
const loginUrl = (contestName) => (`/auth/${contestName}/login`);
const loggedInUrl = (contestName) => (`/auth/${contestName}/loggedIn`);
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
      let body = await resp.json();

      try {
        body = await resp.json();
      }
      catch(e) {
        let message  = await resp.text();

        body = {message};
      }

      return dispatch(login(new Error(body.message)));
    }

    const body = await resp.json();

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

    return dispatch(loggedIn(body.result.user));
  }
};

export const fetchLogout = (contestName) => {
  return async (dispatch) => {
    const resp = await fetch(logoutUrl(contestName), {method: 'POST', credentials: 'include'});

    if(!resp.ok) {
      const body = await resp.json();

      return dispatch(loggedIn(new Error(body.message)));
    }

    return dispatch(logout({}));
  }
}

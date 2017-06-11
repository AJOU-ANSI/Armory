// @flow

import {createAction} from 'redux-actions';

export const signup = createAction('SIGNUP');
export const login = createAction('LOGIN');
export const loggedIn = createAction('LOGGEDIN');
export const logout = createAction('LOGOUT');

const signupUrl = '/auth/signup';
const loginUrl = '/auth/login';
const loggedInUrl = '/auth/loggedIn';
const logoutUrl = '/auth/logout';

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
// export const fetchLogin = (data: LoginUser) => {
//   return async (dispatch: Function) => {
//     const resp = await fetch(loginUrl, {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       method: 'POST',
//       body: JSON.stringify(data),
//       credentials: 'include'
//     });
//
//     if(!resp.ok) {
//       let body :authFailResponse;
//
//       try {
//         body = await resp.json();
//       }
//       catch(e) {
//         body = {msg: (await resp.text())};
//       }
//
//       return dispatch(login(new Error(body.msg)));
//     }
//
//     const body: authResponse = await resp.json();
//
//     return dispatch(login(body.result.user));
//   };
// };
//
// export const fetchLoggedIn = () => {
//   return async (dispatch: Function) => {
//     const resp = await fetch(loggedInUrl, {credentials: 'include'});
//
//     if(!resp.ok) {
//       const body: authFailResponse = await resp.json();
//
//       return dispatch(loggedIn(new Error(body.msg)));
//     }
//
//     const body: authResponse = await resp.json();
//
//     return dispatch(loggedIn(body.result.user));
//   }
// };
//
// export const fetchLogout = () => {
//   return async (dispatch: Function) => {
//     const resp = await fetch(logoutUrl, {method: 'POST', credentials: 'include'});
//
//     if(!resp.ok) {
//       const body: authFailResponse = await resp.json();
//
//       return dispatch(loggedIn(new Error(body.msg)));
//     }
//
//     return dispatch(logout({}));
//   }
// }

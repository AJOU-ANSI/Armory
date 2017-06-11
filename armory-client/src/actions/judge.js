// @flow

import {createAction} from 'redux-actions';

import type {Judges} from '../types/MyTypes';

type judgeResponse = {
  result: {
    judges: Judges
  }
};

export const getJudgeMap = createAction('GET_JUDGE_MAP');
export const updateJudgeMap = createAction('UPDATE_JUDGE_MAP');

const judgesUrl = '/api/me/judges';

export const fetchGetJudgeMap = () => {
  return async (dispatch: Function) => {
    const resp = await fetch(judgesUrl, {credentials: 'include'});

    if(!resp.ok) {
      const body = await resp.json();

      return dispatch(getJudgeMap(body.msg));
    }

    const body: judgeResponse = await resp.json();

    return dispatch(getJudgeMap(body.result.judges));
  };
};

export const fetchUpdateJudgeMap = (data: Judges) => {
  return async (dispatch: Function) => {
    const resp = await fetch(judgesUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(data),
      credentials: 'include'
    });

    if(!resp.ok) {
      const body = await resp.json();

      return dispatch(updateJudgeMap(body.msg));
    }

    const body: judgeResponse = await resp.json();

    return dispatch(updateJudgeMap(body.result.judges));
  };
};

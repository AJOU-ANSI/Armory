import {createAction} from 'redux-actions';

export const getContestList = createAction('GET_CONTEST_LIST');
export const getContestByName = createAction('GET_CONTEST_BY_NAME');

export const getUserContestInfo = createAction('GET_USER_CONTEST_INFO');

const contestUrl = '/api/contests';

export const fetchGetUserContestInfo = (contestName, user) => {
  return async (dispatch) => {
    try {
      const resp = await fetch(`/api/${contestName}/users/${user.id}/contestInfo`);

      if (!resp.ok) {
        throw new Error();
      }

      const {result: contestInfo} = await resp.json();

      return dispatch(getUserContestInfo(contestInfo));
    }
    catch(err) {
      return dispatch(getUserContestInfo(err));
    }
  }
};

export const fetchGetContestList = () => {
  return async (dispatch) => {
    try {
      const resp = await fetch(contestUrl, {});

      const body = await resp.json();

      if (!resp.ok) {
        return dispatch(getContestList(new Error(body.message)));
      }

      return dispatch(getContestList(body.result.contest_list));
    }
    catch (e) {
      return dispatch(getContestList(e));
    }
  }
}

export const fetchGetContestByName = (contestName) => {
  return async (dispatch) => {
    try {
      const resp = await fetch(`${contestUrl}/byName/${contestName}`);

      const body = await resp.json();

      if (!resp.ok) {
        return dispatch(getContestByName(new Error(body.message)));
      }

      return dispatch(getContestByName({
        contest: body.result.contest,
        contestName
      }));
    }
    catch (e) {
      return dispatch(getContestByName(e));
    }
  }
}

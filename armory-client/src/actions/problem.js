import {createAction} from 'redux-actions';

export const getProblemList = createAction('GET_PROBLEM_LIST');
export const saveProblem = createAction('SAVE_PROBLEM');
export const getProblemByCode = createAction('GET_PROBLEM_BY_CODE');

export const fetchGetProblemList = (contestName) => {
  return async (dispatch) => {
    try {
      const resp = await fetch(`/api/${contestName}/problems`, {
        method: 'get',
        credentials: 'include'
      });

      if (!resp.ok) {
        throw new Error('Bad request');
      }

      const body = await resp.json();
      const {result: {problem_list}} = body;

      return dispatch(getProblemList(problem_list));
    }
    catch (e) {
      return dispatch(getProblemList(e));
    }


  };
};

export const fetchSaveProblem = (contestName, problemInfo) => {
  return async (dispatch) => {

    try {
      const resp = await fetch(`/api/${contestName}/problems`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(problemInfo),
        credentials: 'include'
      });

      if (!resp.ok) {
        throw new Error('Bad request');
      }

      const body = await resp.json();
      const {result: {problem}} = body;

      return dispatch(saveProblem(problem));
    }
    catch (e) {
      return dispatch(saveProblem(e));
    }
  }
};

export const fetchGetProblemByCode = (contestName, problemCode) => {
  return async (dispatch) => {
    try {
      const resp = await fetch(`/api/${contestName}/problems/${problemCode}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!resp.ok) {
        throw new Error('Bad request');
      }
      
      const body = await resp.json();
      const {result: {problem}} = body;
      
      return dispatch(getProblemByCode(problem));
    }
    catch (e) {
      return dispatch(getProblemByCode(e));
    }
  }
}

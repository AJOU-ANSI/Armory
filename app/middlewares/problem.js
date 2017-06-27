const obj = {
  problemSvc: require('../services/problem')
};

module.exports = obj;

obj.selectProblemListByContestMw = async (req, res, next) => {
  const {contest} = req;

  const {code} = req.query;

  let e;

  try {
    if (code) {
      req.problem_list = await obj.problemSvc.selectProblemCodeListByContest(contest);
    }
    else {
      req.problem_list = await obj.problemSvc.selectProblemListByContest(contest);
    }

  }
  catch (err) {
    e = err;
  }

  return next(e);
};

obj.selectProblemByContestAndProblemCodeParamMw = async (req, res, next) => {
  const {contest, params: {problemCode}} = req;

  let e;

  try {
    req.problem = await obj.problemSvc.selectProblemByContestAndCode(contest, problemCode);
  }
  catch (err) {
    e = err;
  }

  return next(e);
};

obj.saveProblemFromBodyWithContestMw = async (req, res, next) => {
  const {contest, body: problemInfo} = req;

  let e;

  try {
    req.problem = await obj.problemSvc.saveProblemWithContest(problemInfo, contest);
  }
  catch (err) {
    e = err;
  }

  return next(e);
};

obj.updateProblemFromBodyWithContestMw = async (req, res, next) => {
  const {body: problemInfo} = req;
  const {problemId} = req.params;

  let e;

  try {
    req.problem = await obj.problemSvc.updateProblemById(problemId, problemInfo);
  }
  catch (err) {
    e = err;
  }

  return next(e);
};


obj.sendProblemListMw = (req, res) => {
  const {problem_list} = req;

  res.send({
    result: {
      problem_list
    }
  });
};

obj.sendProblemMw = (req, res) => {
  const {problem} = req;

  res.send({
    result: {problem}
  });
};

obj.sendProblemDataMw = (req, res) => {
  const {problem_data} = req;

  res.send({
    result: {
      problem_data
    }
  });
};

const obj = {
  problemSvc: require('../services/problem')
};

module.exports = obj;

obj.selectProblemListByContestMw = async (req, res, next) => {
  const {contest} = req;

  let e;

  try {
    req.problem_list = await obj.problemSvc.selectProblemListByContest(contest);
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
    const problem = await obj.problemSvc.saveProblem(problemInfo);

    await problem.setContest(contest);

    req.problem = problem;
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

  console.log(problem);

  res.send({
    result: {problem}
  });
};

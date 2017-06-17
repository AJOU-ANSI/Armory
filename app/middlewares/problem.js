const obj = {
  problemSvc: require('../services/problem')
};

module.exports = obj;

const aWrap = fn => (...args) => fn(...args).catch(args[args.length - 1])

obj.selectProblemListByContestMw = aWrap(async (req, res, next) => {
  const {contest} = req;

  let e;

  try {
    req.problem_list = await obj.problemSvc.selectProblemListByContest(contest);
  }
  catch (err) {
    e = err;
  }

  return next(e);
});

obj.selectProblemByContestAndProblemCodeParamMw = aWrap(async (req, res, next) => {
  const {contest, params: {problemCode}} = req;

  let e;

  try {
    req.problem = await obj.problemSvc.selectProblemByContestAndCode(contest, problemCode);
  }
  catch (err) {
    e = err;
  }

  return next(e);
});

obj.saveProblemFromBodyWithContestMw = aWrap(async (req, res, next) => {
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
});

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

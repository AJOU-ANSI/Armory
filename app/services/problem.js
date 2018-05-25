const obj = {
  db: require('../models')
};

module.exports = obj;

obj.saveProblemWithContest = (problemInfo, contest) => {
  const {title, code, description, score} = problemInfo;
  const {timeLimit: time_limit, memoryLimit: memory_limit, spj} = problemInfo;

  return obj.db.Problem.create({
    title, code, description, score,
    ProblemInfo: {
      time_limit, memory_limit, spj
    },
    ContestId: contest.id
  }, {
    include: [obj.db.ProblemInfo]
  });
};

obj.selectProblemListByContest = (contest) => {
  return contest.getProblems({include: obj.db.ProblemInfo});
};

obj.selectProblemCodeListByContest = (contest) => {
  return contest.getProblems({
    include: obj.db.ProblemInfo,
    attributes: ['code', 'id']
  });
};

obj.selectProblemByContestAndCode = async (contest, problemCode) => {
  const contestList = await contest.getProblems({where: {code: problemCode}, include: obj.db.ProblemInfo});

  return contestList[0];
};

obj.updateProblemById = async (problemId, problemInfo) => {
  let problem = await obj.db.Problem.findById(problemId, {include: [obj.db.ProblemInfo]});

  problem = await problem.updateAttributes({
    title: problemInfo.title,
    code: problemInfo.code,
    description: problemInfo.description
  });

  await problem.ProblemInfo.updateAttributes({
    time_limit: problemInfo.timeLimit,
    memory_limit: problemInfo.memoryLimit
  });

  return problem;
}

const obj = {
  db: require('../models')
};

module.exports = obj;

obj.saveProblem = (problemInfo) => {
  return obj.db.Problem.create({
    title: problemInfo.title,
    code: problemInfo.code,
    description: problemInfo.description,
    ProblemInfo: {
      time_limit: problemInfo.timeLimit,
      memory_limit: problemInfo.memoryLimit,
      spj: problemInfo.spj
    }
  }, {
    include: [obj.db.ProblemInfo]
  });
};

obj.selectProblemListByContest = (contest) => {
  return contest.getProblems({include: obj.db.ProblemInfo});
};

obj.selectProblemByContestAndCode = async (contest, problemCode) => {
  const contestList = await contest.getProblems({where: {code: problemCode}, include: obj.db.ProblemInfo});

  return contestList[0];
}
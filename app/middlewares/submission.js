const obj = {
  db: require('../models')
};

module.exports = obj;

const languageMap = {
  'text/x-csrc': 0,
  'text/x-c++src': 1,
  'text/x-java': 2
};

obj.saveSubmissionWithContestAndProblemMw = async function (req, res, next) {
  const {user, contest, problem} = req;
  const {code, language} = req.body;

  const languageValue = languageMap[language];

  try {
    const submission = await obj.db.Submission.create({
      language: languageValue,
      code
    });

    await submission.setProblem(problem);
    await submission.setUser(user);
    await submission.setContest(contest);

    req.submission = submission;

    return next();
  }
  catch(e) {
    return next(e);
  }
};

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
      code,
      ProblemId: problem.id,
      UserId: user.id,
      ContestId: contest.id,
      problem_code: problem.code
    });

    req.submission = submission;

    return next();
  }
  catch(e) {
    return next(e);
  }
};

obj.selectSubmissionListByUserMw = async function (req, res, next) {
  const {user} = req;

  try {
    req.submission_list = await user.getSubmissions();

    return next();
  }
  catch(e) {
    return next(e);
  }

};

obj.sendSubmissionMw = function (req, res) {
  const {submission} = req;

  res.send({
    result: {
      submission
    }
  });
};

obj.sendSubmissionListMw = function (req, res) {
  let {submission_list} = req;

  submission_list = submission_list.get({plain: true});

  for (let i = 0; i < submission_list.length; i++) {
    if (submission_list[i].result !== 11) { // compile error
      delete submission_list[i].result;
    }
  }

  res.send({
    result: {
      submission_list
    }
  });
};

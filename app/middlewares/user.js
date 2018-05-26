const
  csv = require('csvtojson'),
  db = require('../models'),
  UnauthorizedError = require('../errors/unauthorized');

const obj = {
  // userSvc: requireFrom('services/user')
};

obj.saveUserWithContestAndCsvFile = function (req, res, next) {
  const {file, contest} = req, arr =[];

  csv()
    .fromString(file.buffer.toString())
    .on('csv', row => {
      console.log(row);
      arr.push(db.User.create({
        strId: row[0],
        password: row[1],
        groupName: row[2],
        name: row[3],
        ContestId: contest.id
      }));
    })
    .on('end', async () => {
      try {
        let userList = [];
        const uploadLen = 20;

        for (let i = 0; i < arr.length; i+=uploadLen) {
          userList = userList.concat(await Promise.all(arr.slice(i * uploadLen, (i + 1) * uploadLen)));
          console.log(`${i}번째 그룹 업로드 완료`);
        }

        req.userList = userList;
        return next();
      }
      catch (e) {
        return next(e);
      }
    });
};

obj.sendUserFromReqMw = function (req, res) {
  const {user} = req;

  res.send({
    result: {user}
  });
};

obj.sendUserListFromReqMw = function (req, res) {
  const {userList} = req;

  res.send({
    result: {
      user_list: userList
    }
  });
};

obj.checkUserWithContestNameParamMw = async (req, res, next) => {
  const {contestName} = req.params;
  let e;

  try {
    const contest = await req.user.getContest();

    if (contest.name !== contestName) {
      throw new UnauthorizedError('해당 대회 소속이 아닙니다.');
    }
  }
  catch (err) {
    e = err;
  }

  return next(e);
};

obj.selectAllUsersExceptAdminByContestMw = async (req, res, next) => {
  const {contest} = req;

  try {
    req.userList = await contest.getUsers({where: {isAdmin: false}});

    return next();
  }
  catch(e) {
    return next(e);
  }
};

module.exports = obj;

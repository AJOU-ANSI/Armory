const
  express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/api/v2/admin', router);
};

router.post('/users', async function (req, res, next) {
  const {token, userId, userPwd, contestName} = req.body;

  if (token !== config.token) {
    return res.status(401).send({});
  }

  try {
    const contest = await db.Contest.findOne({where: {name: contestName}});

    const user = await db.User.create({
      strId: userId,
      password: userPwd,
      ContestId: contest.id,
      isAdmin: true
    });

    return res.send({user});
  }
  catch(e) {
    return next(e);
  }

});

//
// function getContestDate(offset) {
//   const date = new Date();
//
//   date.setHours(date.getHours() + offset);
//   date.setMinutes(0);
//   date.setSeconds(0);
//
//   return date;
// }
//
// router.get('/init_db', async function (req, res) {
//
//   /** ------------------ contest 1 ----------------- **/
//   const [contest, created] = await db.Contest.findOrCreate({where: {name: 'shake17'}, defaults: {
//     name: 'shake16closed',
//     start: getContestDate(-7),
//     end: getContestDate(-2)
//   }});
//
//   const users = [];
//
//   for(let i = 1 ; i <= 9 ; i++) {
//     const strId = 'test0' + i;
//
//
//     let [user] = await db.User.findOrCreate({where: {strId}, defaults: {
//       strId,
//       password: 'q1w2e3r4!',
//     }});
//
//     users.push(user);
//   }
//
//   const [admin] = await db.User.findOrCreate({where: {strId: 'admin01'}, defaults: {
//     strId: 'admin01',
//     password: 'q1w2e3r4!',
//     isAdmin: true
//   }});
//
//   if (created) {
//     for(let i = 0; i < 9; i++) {
//       await users[i].setContest(contest);
//     }
//
//     await admin.setContest(contest);
//   }
//
//   /** ------------------- contest 2 ------------------- **/
//   const [contest2, created2] = await db.Contest.findOrCreate({where: {name: 'shake16'}, defaults: {
//     name: 'shake16',
//     start: getContestDate(10),
//     end: getContestDate(15)
//   }});
//
//   const [admin2] = await db.User.findOrCreate({where: {strId: 'admin02'}, defaults: {
//     strId: 'admin02',
//     password: 'q1w2e3r4!',
//     isAdmin: true
//   }});
//
//   const [user2] = await db.User.findOrCreate({where: {strId: 'test20'}, defaults: {
//     strId: 'test20',
//     password: 'q1w2e3r4!',
//   }});
//
//   if (created2) {
//     await user2.setContest(contest2);
//     await admin2.setContest(contest2);
//   }
//
//   /** --------------- contest 3 --------------------- **/
//
//   const [contest3, created3] = await db.Contest.findOrCreate({where: {name: 'shake16open'}, defaults: {
//     name: 'shake16open',
//     start: getContestDate(-2),
//     end: getContestDate(3)
//   }});
//
//   const [admin3] = await db.User.findOrCreate({where: {strId: 'admin03'}, defaults: {
//     strId: 'admin03',
//     password: 'q1w2e3r4!',
//     isAdmin: true
//   }});
//
//   const [user3] = await db.User.findOrCreate({where: {strId: 'test30'}, defaults: {
//     strId: 'test30',
//     password: 'q1w2e3r4!',
//   }});
//
//   if (created3) {
//     await user3.setContest(contest3);
//     await admin3.setContest(contest3);
//   }
//
//   res.send({});
// });

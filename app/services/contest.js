const
  db = require('../models');

const obj = {
};

module.exports = obj;

obj.selectAllContests = async () => {
  return db.Contest.findAll();
};

obj.selectContestByName = async (contestName) => {
  console.log(contestName);
  return db.Contest.findOne({where: {name: contestName}});
}

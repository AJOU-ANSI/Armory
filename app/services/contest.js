const obj = {
  db: require('../models')
};

module.exports = obj;

obj.selectAllContests = async () => {
  return obj.db.Contest.findAll();
};

obj.selectContestByName = async (contestName) => {
  return obj.db.Contest.findOne({where: {name: contestName}});
};

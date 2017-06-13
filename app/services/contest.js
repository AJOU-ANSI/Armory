const obj = {
  db: require('../models')
};

module.exports = obj;

obj.selectAllContests = () => {
  return obj.db.Contest.findAll();
};

obj.selectContestByName = (contestName) => {
  return obj.db.Contest.findOne({where: {name: contestName}});
};

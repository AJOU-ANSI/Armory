module.exports = function (sequelize, DataTypes) {

  const ProblemData = sequelize.define('ProblemData', {
    filename: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function (models) {
        models.Problem.hasOne(ProblemData);
        ProblemData.belongsTo(models.Problem);
      }
    }
  });

  return ProblemData;
};


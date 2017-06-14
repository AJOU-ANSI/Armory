module.exports = function (sequelize, DataTypes) {

  const ProblemInfo = sequelize.define('ProblemInfo', {
    time_limit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memory_limit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    spj: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        models.Problem.hasOne(ProblemInfo);
        ProblemInfo.belongsTo(models.Problem);
      }
    }
  });

  return ProblemInfo;
};


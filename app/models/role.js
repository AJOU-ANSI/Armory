module.exports = function (sequelize, DataTypes) {
  const Role = sequelize.define('Role', {
    uploadProblems: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'can upload problems'
    },
    viewProblemsAnytime: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'can view problems regardless of contest time'
    }
  }, {
    classMethods: {
      associate: function () {

      }
    }
  });

  return Role;
};


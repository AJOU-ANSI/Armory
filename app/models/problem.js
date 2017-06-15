module.exports = function (sequelize, DataTypes) {

  const Problem = sequelize.define('Problem', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      // associate: function (models) {
      // }
    }
  });

  return Problem;
};


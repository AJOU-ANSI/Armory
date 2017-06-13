module.exports = function (sequelize, DataTypes) {

  const Problem = sequelize.define('Problem', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        // Contest.hasMany(models.User);
        // models.User.belongsTo(Contest);
      }
    }
  });

  return Problem;
};


module.exports = function (sequelize, DataTypes) {

  const Problem = sequelize.define('Problem', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inputDesc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    outputDesc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inputSample: {
      type: DataTypes.STRING,
      allowNull: false
    },
    outputSample: {
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


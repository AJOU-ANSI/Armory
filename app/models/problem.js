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
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    indexes: [
      {
        unique: true, fields: ['code', 'ContestId']
      }
    ],
    classMethods: {
      // associate: function (models) {
      // }
    }
  });

  return Problem;
};


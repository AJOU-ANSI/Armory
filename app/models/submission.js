module.exports = function (sequelize, DataTypes) {

  const Submission = sequelize.define('Submission', {
    language: {
      type: DataTypes.INTEGER, // c/c++/java
      allowNull: false,
      validate: {
        max: 2,
        min: 0
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        models.User.hasMany(Submission);
        Submission.belongsTo(models.User);

        models.Problem.hasMany(Submission);
        Submission.belongsTo(models.Problem);

        models.Contest.hasMany(Submission);
        Submission.belongsTo(models.Contest);
      }
    }
  });

  return Submission;
};


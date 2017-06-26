module.exports = function (sequelize, DataTypes) {

  const Qna = sequelize.define('Qna', {
    question: {
      type: DataTypes.TEXT
    },
    problemCode: {
      type: DataTypes.STRING
    },
    answer: {
      type: DataTypes.TEXT
    },
    answeredAt: {
      type: DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function (models) {
        models.Contest.hasMany(Qna);
        Qna.belongsTo(models.Contest);

        models.User.hasMany(Qna);
        Qna.belongsTo(models.User);
      }
    }
  });

  return Qna;
};


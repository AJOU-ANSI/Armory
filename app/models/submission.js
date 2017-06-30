/**
 *
 enum JudgeResult {
    // Waiting
    kPending,
    kPendingRejudge,
    // Judging
    kCompiling,
    kRunning,
    // Judge results
    kAccepted,
    kPresentationError,   5
    kWrongAnswer,         6
    kTimeLimitExceed,     7
    kMemoryLimitExceed,   8
    kOutputLimitExceed,   9
    kRuntimeError,        10
    kCompileError,        11
    kCompileSuccess
};
 */
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
      type: DataTypes.TEXT,
      allowNull: false
    },
    result: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        max: 12,
        min: 0
      }
    },
    memory_usage: {
      type: DataTypes.INTEGER
    },
    time_usage: {
      type: DataTypes.INTEGER
    },
    result_message: {
      type: DataTypes.TEXT
    },
    problem_code: {
      type: DataTypes.STRING
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


module.exports = function (sequelize, DataTypes) {

  const Notification = sequelize.define('Notification', {
    content: {
      type: DataTypes.TEXT
    }
  }, {
    classMethods: {
      associate: function (models) {
        models.Contest.hasMany(Notification);
        Notification.belongsTo(models.Contest);
      }
    }
  });

  return Notification;
};


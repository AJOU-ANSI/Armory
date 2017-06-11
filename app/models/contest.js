const
  uuidv4 = require('uuid/v4');

module.exports = function (sequelize, DataTypes) {

  const Contest = sequelize.define('Contest', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      unique: true
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return this.getDataValue('start').getTime();
      }
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return this.getDataValue('end').getTime();
      }
    }
  }, {
    classMethods: {
      associate: function (models) {
        Contest.hasMany(models.User);
        models.User.belongsTo(Contest);
      }
    }
  });

  return Contest;
};


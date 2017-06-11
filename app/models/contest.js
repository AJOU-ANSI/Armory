const
  uuidv4 = require('uuid/v4');

module.exports = function (sequelize, DataTypes) {

  var Contest = sequelize.define('Contest', {
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
        console.log(this.getDataValue('start'));

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
        // example on how to add relations
        // Article.hasMany(models.Comments);
      }
    }
  });

  return Contest;
};


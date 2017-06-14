const
  crypto      = require('crypto'),
  secret      = require('../../config/config').secret;

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
      validate: {
        is: /^[A-Za-z0-9!@#$%]{8,20}$/
      }
    },
    strId: {
      type: DataTypes.STRING(30)
    },
    groupName: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        // example on how to add relations
        // Article.hasMany(models.Comments);
      },
    },
    instanceMethods: {
      validatePassword: function (source) {
        let hmac = crypto.createHmac('sha256', secret);

        return hmac.update(source).digest('hex') === this.password;
      },
      toJSON: function () {
        const values = Object.assign({}, this.get());

        delete values.password;

        return values;
      }
    },
    hooks: {
      afterValidate: function(user) {
        let hmac = crypto.createHmac('sha256', secret);
        user.password = hmac.update(user.password).digest('hex');
      }
    }
  });

  return User;
};


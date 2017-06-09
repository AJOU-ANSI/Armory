var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'armory'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/armory-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'armory'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/armory-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'armory'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/armory-production'
  }
};

module.exports = config[env];

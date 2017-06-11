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
    db: 'mysql://localhost/armory-development',
    secret: 'this is dev secret'
  },

  test: {
    root: rootPath,
    app: {
      name: 'armory'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/armory-test',
    secret: 'this is test secret'
  },

  production: {
    root: rootPath,
    app: {
      name: 'armory'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/armory-production',
    secret: 'this is prod secret'
  }
};

module.exports = config[env];

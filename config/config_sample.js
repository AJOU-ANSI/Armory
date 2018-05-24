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
    secret: 'this is dev secret',
    superAdminToken: '12345',
    rankServer: 'http://localhost:8080'
  },

  test: {
    root: rootPath,
    app: {
      name: 'armory'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/armory-test',
    secret: 'this is test secret',
    superAdminToken: '12345',
    rankServer: 'http://localhost:8080'
  },

  production: {
    root: rootPath,
    app: {
      name: 'armory'
    },
    port: process.env.PORT || 3000,
    db: process.env.DB || 'mysql://localhost/armory-production',
    secret: process.env.SECRET || 'this is prod secret',
    superAdminToken: process.env.SUPER_ADMIN_TOKEN || '12345',
    rankServer: process.env.RANK_HOST || 'http://localhost:8080'
  }
};

module.exports = config[env];

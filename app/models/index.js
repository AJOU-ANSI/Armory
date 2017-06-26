var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  db = {};

var sequelize = new Sequelize(process.env.JAWSDB_URL || config.db, {
  logging: (process.env.NODE_ENV === 'production') ? false : console.log
});

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
  var model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

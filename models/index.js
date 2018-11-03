const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const sequelize = require('../database');

const db = {
  sequelize,
  Sequelize,
};

fs.readdirSync(__dirname)
  .filter(file => path.extname(file) === '.js' && file !== 'index.js')
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = db;

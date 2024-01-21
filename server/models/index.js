require("dotenv").config();

const fs = require("fs");
const path = require("path");
const db = {};

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[file.replace(".js", "")] = model(sequelize, Sequelize);
  });
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.User.hasMany(db.Thread, {
//   foreignKey: "uid",
// });

module.exports = db;

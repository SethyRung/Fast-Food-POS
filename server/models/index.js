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

db.Categories.hasMany(db.Products);
db.Products.belongsToMany(db.Orders, { through: "OrderProducts" });
db.Products.belongsTo(db.Categories);
db.Customers.belongsTo(db.Orders);
db.Employees.hasMany(db.Orders);
db.Orders.belongsTo(db.Customers);
db.Orders.belongsTo(db.Employees);
db.Orders.belongsToMany(db.Products, { through: "OrderProducts" });

module.exports = db;

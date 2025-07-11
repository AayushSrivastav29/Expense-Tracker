const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalExpense: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Users;

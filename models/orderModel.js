const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
        defaultValue: "PENDING",
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Order;
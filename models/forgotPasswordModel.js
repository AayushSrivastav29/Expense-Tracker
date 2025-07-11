const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");
const  uuid = require('uuid');

const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequests', {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = ForgotPasswordRequests;
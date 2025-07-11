const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Payment = sequelize.define('Payment', {
    orderId: {
        type: Sequelize.STRING(),
        allowNull: false,
        primaryKey: true
    },
    paymentSessionId: {
        type: Sequelize.STRING(),
        allowNull: false
    },
    orderAmount:{
        type: Sequelize.INTEGER,
        allowNull :false
    },
    orderCurrency:{
        type: Sequelize.STRING(),
        defaultValue:"INR",
    },
    paymentStatus:{
        type: Sequelize.STRING(),
        defaultValue:"pending",
    }
})
module.exports=Payment;


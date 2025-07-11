const { Sequelize } = require("sequelize");
require('dotenv').config();



const sequelize = new Sequelize(process.env.SCHEMA_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: "localhost",
  dialect:
    "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to db successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
 

// find total expenses & group by userid
// extract name of user from userid from usertable

const { Users } = require("../models");
const sequelize = require("../utils/db-connection");

const totalExpensesOfUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: users.map((u) => ({
        userName: u.name,
        totalExpenses: parseFloat(u.totalExpense),
      })),
    });
  } catch (error) {
    console.error("Error fetching total expenses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching total expenses",
      error: error.message,
    });
  }
};

module.exports = {
  totalExpensesOfUsers,
};



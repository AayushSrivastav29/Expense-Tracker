const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

const secretKey = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    //console.log(token);
    const getUserId = jwt.verify(token, secretKey);

    Users.findByPk(getUserId.UserId)
      .then((user) => {
        //
        req.user = user;

        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ success: false, message: "cant authenticate user" });
  }
};

module.exports = authenticate;

const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const sib = require("sib-api-v3-sdk");
const sequelize = require("../utils/db-connection");
const { ForgotPasswordRequests } = require("../models");
const sibApiKey = process.env.FORGET_PASSWORD_API;
const secretKey = process.env.SECRET_KEY;
const path = require('path');

const generateAccessToken = (id) => {
  return jwt.sign({ UserId: id }, secretKey);
};

//getbyEmail
const findUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({
      where: {
        email: email,
      },
    });

    bcrypt.compare(password, user.password, function (err, result) {
       if (err) {
        return res.status(500).send("Error comparing passwords");
      }
      if (!result) {
        return res.status(401).send("Password incorrect");
      }
      if (result) {
        return res
          .status(200)
          .json({
            success: true,
            message: "User logged in",
            token: generateAccessToken(user.id),
            user: user,
          });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).send(`No user exsits`, error);
  }
};

//create
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      // Store hash in your password DB.
      console.log("err in pasword hashing", err);
      await Users.create({
        name: name,
        email: email,
        password: hash,
      });
      res.status(201).send(`user signed up successfully`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(`make sure to use unique email id`);
  }
};

//update password
 const updateUser = async (req,res)=>{
  const transaction = await sequelize.transaction();
  try {
    const {email, password}= req.body;
    //find user
    const user = await Users.findOne({
      where:{
        email: email
      },
      transaction
    })

    if (!user) {
      await transaction.rollback();
      return res.status(404).send("User not found");
    }

    // Use async/await version of bcrypt.hash
    const hash = await bcrypt.hash(password, 10);

    // Update password
    await user.update({ password: hash }, { transaction });


      //check request
      const resetRequest = await ForgotPasswordRequests.findOne({
        where:{
          UserId:user.id
        },
        transaction
      });

      //expire link
      await resetRequest.update({
        isActive : false
      }, {transaction});

      await transaction.commit();
      res.status(201).send(`password changed successfully`);
    
    
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).send("error in changing password")
  }

 }


//forgot password

const forgotPassword = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const client = sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = sibApiKey;

    const transEmailApi = new sib.TransactionalEmailsApi();

    const sender = {
      email: "workholik23@gmail.com",
      name: "Expense Tracker",
    };

    const { email } = req.body;

    const user = await Users.findOne({
      where: {
        email: email,
      },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).send("email id doesnt exist.")
    }

    const UserId = user.id;

    const resetPasswordRequest = await ForgotPasswordRequests.create({
      isActive: true,
      UserId: UserId,
    });

    const reciever = [
      {
        email: email,
      },
    ];
    if (!resetPasswordRequest) {
      await transaction.rollback();
      return res
        .status(500)
        .send("error in saving details to reset password table");
    }


    const result = await transEmailApi.sendTransacEmail({
      sender,
      to: reciever,
      subject: "Reset your password",
      htmlContent: `
        <body>
          <h2>Reset password</h2>
          <p>Click this link to reset your password:</p>
          <a href="http://localhost:3000/api/user/resetpassword/${resetPasswordRequest.id}" 
            style="display: inline-block; padding: 10px; background: #007bff; color: white; text-decoration: none;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
        </body>
        `
    });
    res.status(200).send("Password reset request sent");
  } catch (error) {
    console.log(error);
    res
      .send(500)
      .send(`forgot password module not working, Error: ${error.message}`);
  }
};

//reset password
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const resetRequest = await ForgotPasswordRequests.findOne({
      where:{
        id:id,
        isActive: true,
      }
    })
      if (!resetRequest) {
      return res.status(400).send("Invalid or expired reset link");
      }


    res.sendFile('/home/aayush-srivastav/Desktop/Sharpener Prac/Project/Day-to-Day-Expense-App/view/resetPassword.html');

  } catch (error) {
    console.log(error);
    res.status(500).send('cant reset password:', error.message)
  }
};

module.exports = {
  findUser,
  createUser,
  updateUser,
  forgotPassword,
  resetPassword,
};

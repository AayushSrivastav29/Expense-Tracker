const { Users } = require("../models");
const Expense = require("../models/expenseModel");
const sequelize = require("../utils/db-connection");
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const { param } = require("../routes/userRoute");

//create
const createExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const addExpense = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      UserId: req.user.id,
    });
    const user= await Users.findByPk(req.user.id);
    user.update({
      totalExpense: user.totalExpense+ parseFloat(amount)
    })
    res.status(201).send(addExpense);
  } catch (error) {
    console.log(error);
    res.status(500).send(`error in creating expense: ${error}`);
  }
};

//read
const getExpense = async (req, res) => {
  try {
    const allExpense = await Expense.findAll({
      where: {
        UserId: req.user.id,
      },
    });

    if (allExpense.length === 0) {
      return res.status(404).send(`No expense record found`);
    } else {
      res.status(200).send(allExpense);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(`error in retreiving all expense record: ${error.message}`);
  }
};

//delete
const deleteExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;
    //find the expense 
    const expense= await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).send(`expense not found to be deleted with id; ${id}`)
    }
    //delete
    const deleteExpense= await Expense.destroy({
      where: {
        id: id,
      },
      transaction,
    });
    
    const UserId= req.user.id;
    //subtract from total expenses    
    const user =await Users.findByPk(UserId);

    user.update({
      totalExpense: user.totalExpense-expense.amount,
      transaction,
    })

    if (!deleteExpense) {
      return res.status(404).send("Expense not found");
    } else {
      await transaction.commit();
      res.status(201).send("expense deleted successfully");
    }
  } catch (error) {
    await transaction.rollback();
    res.status(500).send("Expense cannot be deleted", error);
    console.log(error);
  }
};

//update
const updateExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const { amount, description, category } = req.body;

    // First find the expense to update
    const expenseToUpdate = await Expense.findByPk(id);

    if (!expenseToUpdate) {
      return res.status(404).send(`Expense with id: ${id} not found`);
    }

    // Update the expense with new values
    const updatedExpense = await expenseToUpdate.update({
      amount,
      description,
      category,
    });

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).send("Expense could not be updated");
  }
};

//download expense report
const downloadExpenseReport = async(req,res)=>{
  try {

    const allExpense = await Expense.findAll({
      where: {
        UserId: req.user.id,
      },
    });
    
    // 2. Create CSV content
    let csvData = 'Date,Description,Category,Expense,Income\n';

    allExpense.forEach(expense => {
      const date = new Date(expense.createdAt).toLocaleDateString('en-IN');
      const description = expense.description;
      let category = expense.category;
      const amount = expense.amount;
      
      
      // Validate category
      const validCategories = ['groceries', 'entertainment', 'rent', 'bills', 'fuel', 'salary', 'essentials'];
      if (!validCategories.includes(category)) {
        category = 'uncategorized';
      }
      
      // Income column only shows salary, others go to Expense
      const income = category === 'salary' ? amount : '';
      const expenseAmount = category !== 'salary' ? amount : '';
      
      csvData += `${date},${description},${category},${expenseAmount},${income}\n`;
    });

    // 3. Generate monthly summary
    const monthlySummary = {};
    allExpense.forEach(expense => {
      const monthYear = new Date(expense.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!monthlySummary[monthYear]) {
        monthlySummary[monthYear] = { income: 0, expense: 0 };
      }

      if (expense.category === 'salary') {
        monthlySummary[monthYear].income += parseFloat(expense.amount);
      } else {
        monthlySummary[monthYear].expense += parseFloat(expense.amount);
      }
    });
    

    // 4. Generate yearly summary
    const yearlySummary = {};
    allExpense.forEach(expense => {
      const year = new Date(expense.createdAt).getFullYear();
      if (!yearlySummary[year]) {
        yearlySummary[year] = { income: 0, expense: 0 };
      }
      
      if (expense.category === 'salary') {
        yearlySummary[year].income += parseFloat(expense.amount);
      } else {
        yearlySummary[year].expense += parseFloat(expense.amount);
      }
    });
    
    // 5. Add summary tables to CSV
    csvData += '\n\nMonthly Summary\nMonth,Income,Expense,Savings\n';
    Object.entries(monthlySummary).forEach(([month, data]) => {
      const savings = data.income - data.expense;
      csvData += `${month},${data.income},${data.expense},${savings}\n`;
    });
    
    csvData += '\n\nYearly Summary\nYear,Income,Expense,Savings\n';
    Object.entries(yearlySummary).forEach(([year, data]) => {
      const savings = data.income - data.expense;
      csvData += `${year},${data.income},${data.expense},${savings}\n`;
    });

    // 3. create a temporary file-unique everytime
    const id = req.user.id;
    const filename = `expenses${id}/${Date.now()}.csv`;

    const fileUrl = await uploadToS3(csvData,filename);
    console.log("fileUrl>>>>>>>>>>", fileUrl);
    res.status(200).json({fileUrl, success: true});


  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send expenses to AWS' });
  }
}

 function uploadToS3(data, filename) {
  try {
    
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY= process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
    
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    })
    
    let params= {
      Bucket: BUCKET_NAME,
      Key:filename,
      Body:data,
      ACL: 'public-read'
    }
    return new Promise((res,rej)=>{
      s3bucket.upload(params,(err,result)=>{
        if (err) {
          console.log("AWS bucket err:", err);
          rej("AWS bucket err");
        } else {
          console.log("successful file upload: ", result);
          res(result.Location);
        }
      })
      
    })
    
  } catch (error) {
    console.log(error);
  }

}

module.exports = {
  getExpense,
  createExpense,
  deleteExpense,
  updateExpense,
  downloadExpenseReport
};

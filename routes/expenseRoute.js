const express = require('express');
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.get('/',authenticate,expenseController.getExpense)
router.post('/add', authenticate ,expenseController.createExpense );
router.delete('/delete/:id',authenticate, expenseController.deleteExpense);
router.put('/edit/:id' , expenseController.updateExpense)
router.get('/download', authenticate ,expenseController.downloadExpenseReport);

module.exports = router;
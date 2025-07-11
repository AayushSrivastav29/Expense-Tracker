const express = require('express');
const premiumController = require('../controllers/premiumController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/leaderboard', premiumController.totalExpensesOfUsers);

// router.post('/pay', authMiddleware, paymentController.processPayment);
// router.get('/status/:paymentSessionId', paymentController.getPaymentStatus);

module.exports = router;
const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', paymentController.getPaymentPage);
router.post('/pay', authMiddleware, paymentController.processPayment);
router.get('/status/:paymentSessionId', paymentController.getPaymentStatus);

module.exports = router;
const {
  createOrder,
  getPaymentStatus,
} = require("../services/cashfreeService");
const Payment = require('../models/paymentModel');
const Order = require('../models/orderModel');
const Users = require('../models/userModel');
const path = require('path');
const TemplateGenerator = require("../Template/htmltemp");


exports.getPaymentPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../view/home.html"));
};

exports.processPayment = async (req, res) => {
  const  UserId  = req.user.id;
  const orderId = "ORDER-" + Date.now();
  const orderAmount = 2000;
  const orderCurrency = "INR";
  const customerId = "1";
  const customerPhone = "9999999999";

  try {
    // Create order in database first
    const order = await Order.create({
      orderId,
      status: 'PENDING',
      amount: orderAmount,
      UserId,
    });

    // Create payment in Cashfree
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone
    ); 
    // Save payment details
    await Payment.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      paymentStatus: "PENDING",
    });

    res.json({ paymentSessionId, orderId });

  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({
      message: "Error processing payment",
      success: false
    });
  }
};



exports.getPaymentStatus = async (req, res) => {
  const paymentSessionId = req.params.paymentSessionId;

  try {
    // Step 1: Fetch order status from Cashfree
    const orderStatus = await getPaymentStatus(paymentSessionId); 

    const payment = await Payment.findOne({ 
      where: { orderId : paymentSessionId } 
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    //  Update Payment table
    await Payment.update(
      { paymentStatus: orderStatus },
      { where: { orderId : paymentSessionId } }
    );

    //  Update Order table
    await Order.update(
      { status: orderStatus }, 
      { where: { orderId: payment.orderId } }
    );


    // Step 4: If payment is successful, mark user as premium
    if (orderStatus === "Success") {
        const order = await Order.findOne({ 
        where: { orderId: payment.orderId } 
      });

      if (order && order.UserId) {
        await Users.update(
          { isPremium: true },
          { where: { id: order.UserId } }
        );
      }
    }

    const htmlTemp = TemplateGenerator(payment.orderId, orderStatus, payment.orderAmount);
    res.send(htmlTemp);

  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({ message: "Error fetching payment status" });
  }
};

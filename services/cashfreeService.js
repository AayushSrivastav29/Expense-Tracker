const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APPID,
  process.env.CASHFREE_SECRET_KEY
);

exports.createOrder = async (
  orderId,
  orderAmount,
  orderCurrency = "INR",
  customerId,
  customerPhone
) => {
  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); //1hr from now
    const formattedExpiryDate = expiryDate.toISOString();

    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,

      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
      },

      order_meta: {
        return_url: `http://localhost:3000/api/payment/status/${orderId}`,
        //notify_url: "https://www.cashfree.com/devstudio/preview/pg/webhooks/46631095",

        payment_methods: "ccc, upi, nb",
      },

      order_expiry_time: formattedExpiryDate, //set valid expiry date
    };

    const response = await cashfree.PGCreateOrder(request);
    // Return the payment_session_id from the response
    return response.data.payment_session_id;
  } catch (error) {
    console.error("Cashfree error:", error.response?.data || error.message);
    throw error;
  }
};

exports.getPaymentStatus = async (orderId) => {
  try {
    const response = await cashfree.PGOrderFetchPayments(orderId);

    let getOrderResponse = response.data;
    let orderStatus;

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Success";
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }
    return orderStatus;
  } catch (error) {
    console.error("Error fetching order status:", error.message);
  }
};


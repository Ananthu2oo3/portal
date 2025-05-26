const express = require('express');
const router = express.Router();

const { handleLogin } = require('../controllers/loginController');
const { getCustomerProfile } = require('../controllers/customerProfileController');
const { getInquiryData } = require('../controllers/inquiryData');
const { getDeliveryData } = require('../controllers/delivery');
const { getSalesOrderData } = require('../controllers/salesOrderData');
const { getOverallSalesData } = require('../controllers/overallSales');
const { getCreditDebitData } = require('../controllers/creditDebitMemo');
const { getPaymentAgingData } = require('../controllers/paymentAging')

router.post('/login', handleLogin);
router.post('/customer-profile', getCustomerProfile);
router.post('/inquiry-data', getInquiryData);
router.post('/delivery-data', getDeliveryData);
router.post("/sales-order-data", getSalesOrderData)
router.post("/overall-sales", getOverallSalesData);
router.post("/credit-debit-memo", getCreditDebitData);
router.post("/payment-aging", getPaymentAgingData)

module.exports = router;
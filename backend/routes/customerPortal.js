const express = require('express');
const router = express.Router();

const { handleLogin } = require('../controllers/loginController');
const { getCustomerProfile } = require('../controllers/customerProfileController');
const { getInquiryData } = require('../controllers/inquiryData');
const { getDeliveryData } = require('../controllers/delivery');
const { getSalesOrderData } = require('../controllers/salesOrderData');

router.post('/login', handleLogin);
router.post('/customer-profile', getCustomerProfile);
router.post('/inquiry-data', getInquiryData);
router.post('/delivery-data', getDeliveryData);
router.post("/sales-order-data", getSalesOrderData)

module.exports = router;
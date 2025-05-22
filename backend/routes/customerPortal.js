const express = require('express');
const router = express.Router();

const { handleLogin } = require('../controllers/loginController');
const { getCustomerProfile } = require('../controllers/customerProfileController');
const { getInquiryData } = require('../controllers/inquiryData');

router.post('/login', handleLogin);
router.post('/customer-profile', getCustomerProfile);
router.post('/inquiry-data', getInquiryData);

module.exports = router;
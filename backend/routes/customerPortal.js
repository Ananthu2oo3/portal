const express = require('express');
const router = express.Router();

const { handleLogin } = require('../controllers/loginController');
const { getCustomerProfile } = require('../controllers/customerProfileController');

router.post('/login', handleLogin);
router.post('/customer-profile', getCustomerProfile);

module.exports = router;
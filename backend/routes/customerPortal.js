const express = require('express');
const router = express.Router();

// Customer Portal Routes

const { handleLogin } = require('../controllers/customer/loginController.js');
const { getCustomerProfile } = require('../controllers/customer/customerProfileController.js');
const { getInquiryData } = require('../controllers/customer/inquiryData.js');
const { getDeliveryData } = require('../controllers/customer/delivery.js');
const { getSalesOrderData } = require('../controllers/customer/salesOrderData.js');
const { getOverallSalesData } = require('../controllers/customer/overallSales.js');
const { getCreditDebitData } = require('../controllers/customer/creditDebitMemo.js');
const { getPaymentAgingData } = require('../controllers/customer/paymentAging.js')
const { getInvoiceData } = require('../controllers/customer/invoice.js');

router.post('/login', handleLogin);
router.post('/customer-profile', getCustomerProfile);
router.post('/inquiry-data', getInquiryData);
router.post('/delivery-data', getDeliveryData);
router.post("/sales-order-data", getSalesOrderData)
router.post("/overall-sales", getOverallSalesData);
router.post("/credit-debit-memo", getCreditDebitData);
router.post("/payment-aging", getPaymentAgingData)
router.post("/invoice-data", getInvoiceData);


// Vendor Portal Routes

const { handleVendorLogin } = require('../controllers/vendor/VendorLogin.js');
const { getVendorProfile } = require('../controllers/vendor/vendorProfile.js');
const { getGoodsReceipt } = require('../controllers/vendor/goodsRequest.js');

router.get('/vendor-login', handleVendorLogin);
router.get("/vendor-profile", getVendorProfile);
router.get("/goods-receipt", getGoodsReceipt);




module.exports = router;
const axios = require('axios');
const xml2js = require('xml2js');

exports.getVendorProfile = async (req, res) => {
  const vendorId = req.body.username;

  if (!vendorId) {
    return res.status(400).json({ status: 'ERROR', message: 'Username (vendor ID) is required in request body' });
  }

  console.log('🔵 [1] Fetching vendor profile for ID:', vendorId);

  const url = `${process.env.VENDOR_PROFILE_URL}('${vendorId}')?$format=xml`;

  const headers = {
    'Accept': 'application/xml',
    'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
    'Cookie': 'sap-usercontext=sap-client=100'
  };

  try {
    const response = await axios.get(url, {
      headers,
      maxBodyLength: Infinity
    });

    console.log('🟢 [2] Vendor profile XML retrieved');

    xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('🔴 [3] Error parsing XML:', err);
        return res.status(500).json({ status: 'ERROR', message: 'Failed to parse XML' });
      }

      const vendorData = result.entry?.content?.['m:properties'];
      if (!vendorData) {
        return res.status(404).json({ status: 'ERROR', message: 'Vendor data not found in response' });
      }

      const cleanData = {
        vendorId: vendorData['d:VendorId'],
        vendorName: vendorData['d:VendorName'],
        vendorCity: vendorData['d:VendoeCity'],
        postalCode: vendorData['d:PostalCode'],
        street: vendorData['d:Street'],
        emailId: vendorData['d:EmailId'],
        paymentTerm: vendorData['d:PaymentTerm'],
        phoneNumber: vendorData['d:PhoneNumber'],
        country: vendorData['d:Country']
      };

      res.json({ status: 'SUCCESS', data: cleanData });
    });

  } catch (error) {
    console.error('🔴 [3] Error retrieving vendor profile:', error.response?.data || error.message);
    res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve vendor profile' });
  }
};

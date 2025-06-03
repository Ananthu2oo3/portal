// // const axios = require('axios');

// // exports.getVendorProfile = async (req, res) => {
// //   const vendorId = req.params.vendorId || '100001'; 
// //   console.log('🔵 [1] Fetching vendor profile for ID:', vendorId);

// //   const url = `${process.env.VENDOR_PROFILE_URL}('${vendorId}')?$format=xml`;

// //   const headers = {
// //     'Accept': 'application/json',
// //     'Content-Type': 'application/xml',
// //     'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
// //     'Cookie': 'sap-usercontext=sap-client=100'
// //   };

// //   try {
// //     const response = await axios.get(url, {
// //       headers,
// //       maxBodyLength: Infinity
// //     });

// //     console.log('🟢 [2] Vendor profile retrieved successfully');
// //     res.json({ status: 'SUCCESS', data: response.data });

// //   } catch (error) {
// //     console.error('🔴 [3] Error retrieving vendor profile:', error.response ? error.response.data : error.message);
// //     res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve vendor profile' });
// //   }
// // };


// const axios = require('axios');

// exports.getVendorProfile = async (req, res) => {
//   const vendorId = req.params.vendorId || '100001'; 
//   console.log('🔵 [1] Fetching vendor profile for ID:', vendorId);

//   const url = `${process.env.VENDOR_PROFILE_URL}('${vendorId}')?$format=xml`;

//   const headers = {
//     'Accept': 'application/xml',  // Changed from JSON to XML since you're expecting XML format
//     'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
//     'Cookie': 'sap-usercontext=sap-client=100'
//   };

//   try {
//     const response = await axios.get(url, {
//       headers,
//       maxBodyLength: Infinity
//     });

//     console.log('🟢 [2] Vendor profile retrieved successfully');
//     console.log('Response Data:', response.data); // Log the XML response for debugging
//     res.set('Content-Type', 'application/xml'); // Optional: If you want to return XML as-is
//     res.status(200).send(response.data);

//   } catch (error) {
//     console.error('🔴 [3] Error retrieving vendor profile:', error.response ? error.response.data : error.message);
//     res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve vendor profile' });
//   }
// };

const axios = require('axios');
const xml2js = require('xml2js'); // ✅ Import xml2js

exports.getVendorProfile = async (req, res) => {
  const vendorId = req.params.vendorId || '100001'; 
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

    // ✅ Parse the XML to JSON
    xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('🔴 [3] Error parsing XML:', err);
        return res.status(500).json({ status: 'ERROR', message: 'Failed to parse XML' });
      }

      // ✅ Extract the needed vendor data from the parsed result
      const vendorData = result.entry.content['m:properties'];

      // Rename keys to cleaner format (optional)
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
    console.error('🔴 [3] Error retrieving vendor profile:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve vendor profile' });
  }
};

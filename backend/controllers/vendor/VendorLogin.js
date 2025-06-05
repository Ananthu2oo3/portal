const axios = require('axios');
const xml2js = require('xml2js');

exports.handleVendorLogin = async (req, res) => {
  console.log('🔵 [1] Received vendor login request');

  const { username, password } = req.query;
  console.log('🔵 [2] Extracted credentials:', { username, password });

  const fullUrl = `${process.env.VENDOR_LOGIN}(VendorId='${username}',VendorPassword='${password}')?$format=xml`;
  console.log('🔵 [3] Full SAP OData URL:', fullUrl);

  const headers = {
    'Accept': 'application/xml',
    'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
    'Cookie': 'sap-usercontext=sap-client=100'
  };

  try {
    const response = await axios.get(fullUrl, {
      headers,
      maxBodyLength: Infinity
    });

    console.log('🟢 [4] Vendor login successful');
    
    // Parse XML
    xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('🔴 Error parsing XML:', err);
        return res.status(500).json({ status: 'ERROR', message: 'Failed to parse SAP response' });
      }

      try {
        const props = result.entry.content['m:properties'];
        const vendorId = props['d:VendorId'];
        const status = props['d:EvStatus'];

        console.log('🧩 [5] Parsed SAP Data:', { vendorId, status });

        return res.status(200).json({
          status: 'SUCCESS',
          data: {
            vendorId,
            loginStatus: status
          }
        });

      } catch (parseError) {
        console.error('🔴 Failed to extract fields from parsed XML:', parseError);
        return res.status(500).json({ status: 'ERROR', message: 'Invalid SAP data structure' });
      }
    });

  } catch (error) {
    console.error('🔴 SAP OData Request Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to contact SAP OData service'
    });
  }
};

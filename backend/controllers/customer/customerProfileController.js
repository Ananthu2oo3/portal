const axios = require('axios');

exports.getCustomerProfile = async (req, res) => {

  const customer_id = req.body.username?.trim(); // ✅ Get from request body

  if (!customer_id) {
    return res.status(400).json({
      status: 'E',
      message: 'Username (customer_id) is required'
    });
  }

  console.log('📥 Received customer_id:', customer_id);

  const soapEnvelope = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:urn="urn:sap-com:document:sap:rfc:functions">
     <soapenv:Header/>
     <soapenv:Body>
        <urn:ZPF_CUST_AKG_FM>
           <IV_CUSTOMER_ID>${customer_id}</IV_CUSTOMER_ID>
        </urn:ZPF_CUST_AKG_FM>
     </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.PROFILE_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': ''
      }
    });

    const xml = response.data;
    console.log('📤 SOAP Response:', xml);

    const getValue = (tag) => {
      const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
      return match ? match[1] : '';
    };

    const customerData = {
      "Customer ID": getValue('CUSTOMER_ID'),
      "Customer Name": getValue('CUSTOMER_NAME'),
      "Country": getValue('COUNTRY'),
      "City": getValue('CITY'),
      "Postal Code": getValue('POSTAL_CODE'),
      "Address": getValue('ADDRESS'),
      "Street": getValue('STREET'),
      "Account Created On": getValue('BANK_CREATED_ON'),
      "Account Created By": getValue('BANK_CREATED_BY'),
      "Account Group": getValue('ACCT_GRP'),
      "Bank Name": getValue('BANNK_NAME'),
      "Bank No": getValue('BANK_NO')
    };

    res.json({
      status: 'S',
      data: customerData
    });

  } catch (error) {
    console.error('❌ SOAP Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      status: 'E',
      message: 'Failed to retrieve customer profile'
    });
  }
};


const axios = require('axios');

exports.getCustomerProfile = async (req, res) => {
  
  // const customer_id  = req.session.username.trim();
  // console.log(req.session.username)
  // const customer_id = "0000000001"

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

    const getValue = (tag) => {
      const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
      return match ? match[1] : '';
    };

    const customerData = {
      customer_id: getValue('CUSTOMER_ID'),
      customer_name: getValue('CUSTOMER_NAME'),
      country: getValue('COUNTRY'),
      city: getValue('CITY'),
      postal_code: getValue('POSTAL_CODE'),
      address: getValue('ADDRESS'),
      street: getValue('STREET'),
      bank_created_on: getValue('BANK_CREATED_ON'),
      bank_created_by: getValue('BANK_CREATED_BY'),
      acct_grp: getValue('ACCT_GRP'),
      bank_name: getValue('BANNK_NAME'),
      bank_no: getValue('BANK_NO')
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


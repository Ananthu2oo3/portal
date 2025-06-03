const axios = require('axios');
const xml2js = require('xml2js');

exports.getInquiryData = async (req, res) => {
  const customer_id = req.body.username?.trim().padStart(10, '0');

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
        <urn:ZIN_CUST_AKG_FM>
          <IV_CUSTOMER_ID>${customer_id}</IV_CUSTOMER_ID>
        </urn:ZIN_CUST_AKG_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.INQUIRY_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': ''
      }
    });

    const xml = response.data;
    console.log('Raw XML Response:', xml);
    
    // Parse the XML response
    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('❌ XML Parse Error:', err);
        return res.status(500).json({
          status: 'E',
          message: 'Failed to parse SOAP response'
        });
      }

      try {
        const items = result['soap-env:Envelope']
          ['soap-env:Body']
          ['n0:ZIN_CUST_AKG_FMResponse']
          ['ET_INQUIRY_LIST']
          ['item'];

        const itemList = Array.isArray(items) ? items : [items];

        res.json({
          status: 'S',
          data: itemList
        });
      } catch (parseError) {
        console.error('❌ Data Extract Error:', parseError);
        res.status(500).json({
          status: 'E',
          message: 'Failed to extract data from SOAP response'
        });
      }
    });

  } catch (error) {
    console.error('❌ SOAP Request Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      status: 'E',
      message: 'Failed to retrieve customer inquiry list'
    });
  }
};

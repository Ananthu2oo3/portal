const axios = require('axios');
const { parseStringPromise } = require('xml2js');

exports.getDeliveryData = async (req, res) => {
  const customer_id = req.body.username?.trim();

  if (!customer_id) {
    return res.status(400).json({
      status: 'E',
      message: 'Username (customer_id) is required',
    });
  }

  console.log('📦 Received customer_id for delivery data:', customer_id);

  const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZDEL_CUST_AKG_FM>
          <IV_KUNNR>${customer_id}</IV_KUNNR>
        </urn:ZDEL_CUST_AKG_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.DELIVERY_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': '',
        'Cookie': 'sap-usercontext=sap-client=100',
      },
      maxBodyLength: Infinity,
    });

    const xml = response.data;
    console.log('📄 Raw XML Response:\n', xml);

    const result = await parseStringPromise(xml, { explicitArray: false });
    console.dir(result, { depth: null });


    const deliveryList = result['soap-env:Envelope']['soap-env:Body']['n0:ZDEL_CUST_AKG_FMResponse']['ET_DELIVERIES']['item']

    //   result['soap-env:Envelope']?.['soap-env:Body']?.['n0:ZDEL_CUST_AKG_FMResponse']?.['ET_DELIVERY_LIST']?.['item'];

    const list = Array.isArray(deliveryList) ? deliveryList : deliveryList ? [deliveryList] : [];

    return res.json({
      status: 'S',
      data: list,
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return res.status(500).json({
      status: 'E',
      message:
        error.message.includes('Failed to parse') ? 'Failed to parse SOAP response' :
        error.message.includes('extract') ? 'Failed to extract delivery data' :
        'Failed to retrieve delivery data',
    });
  }
};

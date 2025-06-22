const axios = require('axios');
const xml2js = require('xml2js');

exports.getPaymentAgingData = async (req, res) => {
  let customer_id = req.body.username?.trim();

  if (!customer_id) {
    return res.status(400).json({
      status: 'E',
      message: 'Username (customer_id) is required'
    });
  }

  // Ensure customer_id is a 10-digit string with leading zeros
  customer_id = customer_id.padStart(10, '0');
  console.log('📥 Formatted customer_id:', customer_id);

  const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZPA_AKG_FM>
          <IV_SOLD_TO_PARTY>${customer_id}</IV_SOLD_TO_PARTY>
        </urn:ZPA_AKG_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.PAYMENT_AGING_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': ''
      }
    });

    const xml = response.data;
    // console.log('Raw XML Response:', xml);

    xml2js.parseString(xml, {
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    }, (err, result) => {
      if (err) {
        console.error('❌ XML Parse Error:', err);
        return res.status(500).json({
          status: 'E',
          message: 'Failed to parse SOAP response'
        });
      }

      try {
        const body = result.Envelope.Body;
        if (!body) throw new Error('SOAP Body not found');

        const responseKey = Object.keys(body)[0];
        const responseData = body[responseKey];

        const items = responseData.ET_AGING?.item;
        const itemList = Array.isArray(items) ? items : items ? [items] : [];

        const mappedList = itemList.map(item => ({
          "Document Number": item.DOC_NUMBER || '',
          "Billing Date": item.BILLING_DATE || '',
          "Payment Terms": item.PAYMENT_TERMS || '',
          "Sold To Party": item.SOLD_TO_PARTY || '',
          "Net Value": item.NET_VALUE || '',
          "Currency": item.CURRENCY || '',
          "Sales Organisation": item.SALES_ORGANISATION || '',
          "Distribution Channel": item.DIST_CHANNEL || '',
          "Due Date": item.DUE_DATE || '',
          "Aging": item.AGING || '',
          // "Customer Name": item.CUSTOMER_NAME || '',
          "Customer City": item.CUSTOMER_CITY || '',
          "Customer Country": item.CUSTOMER_COUNTRY || '',
          "Division": item.DIVISION || ''
        }));

        return res.json({
          status: 'S',
          data: mappedList
        });

      } catch (parseError) {
        console.error('❌ Data Extract Error:', parseError);
        return res.status(500).json({
          status: 'E',
          message: 'Failed to extract data from SOAP response'
        });
      }
    });

  } catch (error) {
    console.error('❌ SOAP Request Error:', error.response ? error.response.data : error.message);
    return res.status(500).json({
      status: 'E',
      message: 'Failed to retrieve customer credit/debit memo list'
    });
  }
};

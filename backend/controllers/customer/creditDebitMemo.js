const axios = require('axios');
const xml2js = require('xml2js');

exports.getCreditDebitData = async (req, res) => {
  let customer_id = req.body.username?.trim();

  if (!customer_id) {
    return res.status(400).json({
      status: 'E',
      message: 'Username (customer_id) is required'
    });
  }

  // Format customer_id as 10 digits
  customer_id = customer_id.padStart(10, '0');
  console.log('📥 Formatted customer_id:', customer_id);

  const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZCD_AKG_FM>
          <IV_KUNNR>${customer_id}</IV_KUNNR>
        </urn:ZCD_AKG_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.CREDIT_DEBIT_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': ''
      }
    });

    const xml = response.data;
    console.log('📄 Raw XML Response:\n', xml);

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

        const items = responseData.ET_CREDIT_MEMO?.item;
        const itemList = Array.isArray(items) ? items : items ? [items] : [];

        // ✅ Map fields to user-friendly keys
        const mappedList = itemList.map(item => ({
          "Billing Document Number": item.BILLING_DOC_NO || '',
          "Billing Type": item.BILLING_TYPE || '',
          "Billing Date": item.BILLING_DATE || '',
          "Sold To Customer": item.SOLD_TO_CUSTOMER || '',
          "Currency": item.CURRENCY || '',
          "Net Value Credit Memo": item.NET_VALUE_CREDIT_MEMO || '',
          "Item Number": item.ITEM_NUMBER || '',
          "Material Number": item.MATERIAL_NUMBER || '',
          "Billing Quantity": item.BILLING_QUANTITY || '',
          // "FI Document Type": item.FI_DOC_TYPE || '',
          // "Company Code": item.COMPANY_CODE || '',
          // "Credit/Debit Nature": item.CREDIT_DEBIT_NATURE || '',
          "Amount Doc Currency": item.AMT_DOC_CURR || '',
          // "Debit/Credit Indicator": item.DEBIT_CREDIT_INDICATOR || '',
          "Customer Number": item.CUSTOMER_NUMBER || '',
          "Sales Unit": item.SALES_UNIT || '',
          "Currency Key": item.CURRENCY_KEY || ''
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

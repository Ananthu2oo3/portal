const axios = require('axios');
const xml2js = require('xml2js');

exports.getSalesOrderData = async (req, res) => {
  const customer_id = req.body.username?.trim();

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
        <urn:ZSOD_AKG_FM>
          <IV_SOLD_TO_PARTY>${customer_id}</IV_SOLD_TO_PARTY>
        </urn:ZSOD_AKG_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.SALES_ORDER_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': ''
      }
    });

    const xml = response.data;
    console.log('Raw XML Response:', xml);

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

        // ✅ Use the correct tag from your XML
        const items = responseData.ET_SALESORD_LIST?.item;
        const itemList = Array.isArray(items) ? items : items ? [items] : [];

        const filteredItemList = itemList.map(item => ({

          "Sales Doc Number": item.SALES_DOC_NUMBER,
          "Material Available Date": item.MATERIAL_AVAILABLE_DATE,
          "Order Quantity": item.ORDER_QUANTITY,
          "Sales Org": item.SALES_ORG,
          "Required Delivery Date": item.REQ_DEL_DATE,
          "Material Description": item.MATERIAL_DECRIPTION,
          "Sales Unit": item.SALES_UNIT  
        }));

        return res.json({
          status: 'S',
          data: filteredItemList
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
      message: 'Failed to retrieve customer sales order list'
    });
  }
};

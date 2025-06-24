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
        const envelope = result['soap-env:Envelope'] || result['SOAP-ENV:Envelope'] || result.Envelope;
        const body = envelope['soap-env:Body'] || envelope['SOAP-ENV:Body'] || envelope.Body;
        const responseNode = body['n0:ZIN_CUST_AKG_FMResponse'] || body.ZIN_CUST_AKG_FMResponse;

        const items = responseNode?.ET_INQUIRY_LIST?.item;

        if (!items) {
          return res.json({
            status: 'S',
            data: []
          });
        }

        // Ensure it's always an array
        const itemList = Array.isArray(items) ? items : [items];

        // Map each item to a clean JSON object
        const documentDataList = itemList.map(item => ({
          "Document Number": item.DOCUMENT_NO || '',
          // "Customer ID": item.CUSTOMER_ID || '',
          "Created On": item.CREATED_ON || '',
          "Created By": item.CREATED_BY || '',
          "Sales Document Currency": item.SD_DOCUMENT_CURRENCY || '',
          // "Document Created Date": item.DOCUMENT_CREATED || '',
          "Sales Organization": item.SALES_ORG || '',
          "Document Currency": item.DOCUMENT_CURRENCY || '',
          "Purchase Order Number": item.PO_NUMBER || '',
          "Material Number": item.MAT_NR || '',
          "Item Number": item.ITEM_NO || '',
          "Item Description": item.ITEM_DES || '',
          "Requested Quantity": item.CUM_REQ_DEL_QUAN || '',
          "Cumulative Quantity": item.CUM_OR_QUAN_SALES || '',
          "Sales Unit": item.SALES_UNIT || ''
        }));


        res.json({
          status: 'S',
          data: documentDataList
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

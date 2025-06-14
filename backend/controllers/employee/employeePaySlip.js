const axios = require('axios');
const xml2js = require('xml2js');

exports.getPaySlipData = async (req, res) => {
  let customer_id = req.body.username?.trim();

  if (!customer_id) {
    return res.status(400).json({
      status: 'E',
      message: 'Username (customer_id) is required'
    });
  }

  customer_id = customer_id.padStart(10, '0');
  console.log('Fetching pay slip for customer_id:', customer_id);

  const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sap="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <sap:ZEPS_AKG_FM>
         <IV_EMPLOYEE_ID>${customer_id}</IV_EMPLOYEE_ID>
      </sap:ZEPS_AKG_FM>
   </soapenv:Body>  
</soapenv:Envelope>`;


  try {
    const response = await axios.post(process.env.PAY_SLIP_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': ''
      }
    });

    xml2js.parseString(response.data, {
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    }, (err, result) => {
      if (err) {
        return res.status(500).json({ status: 'E', message: 'Failed to parse SOAP response' });
      }

      try {
        const body = result.Envelope.Body;
        const responseKey = Object.keys(body)[0];
        const data = body[responseKey];
        const base64PDF = data.EV_PDF_BASE64 || '';
        const items = Array.isArray(data.IV_EMPLOYEE_LIST?.item)
          ? data.IV_EMPLOYEE_LIST.item
          : data.IV_EMPLOYEE_LIST?.item ? [data.IV_EMPLOYEE_LIST.item] : [];

        // If download=true, stream PDF directly
        if (req.query.download === 'true') {
          if (!base64PDF) return res.status(404).send('PDF not available');
          const buffer = Buffer.from(base64PDF, 'base64');
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
          return res.send(buffer);
        }

        // Else return JSON with data and base64
        return res.json({
          status: 'S',
          data: items,
          pdfBase64: base64PDF
        });

      } catch (parseErr) {
        console.error('Parsing Error:', parseErr);
        return res.status(500).json({ status: 'E', message: 'Data extraction failed' });
      }
    });

  } catch (error) {
    console.error('SOAP Error:', error.message);
    return res.status(500).json({ status: 'E', message: 'Failed to fetch invoice data' });
  }
};

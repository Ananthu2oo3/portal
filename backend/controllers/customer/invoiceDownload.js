const axios = require('axios');
const xml2js = require('xml2js');

exports.downloadCustomerInvoice = async (req, res) => {
  const customer = req.body.username?.trim();
  const doc_no = req.body.doc_no?.trim();

  if (!customer) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Username (customer) is required in request body'
    });
  }

  if (!doc_no) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Document Number (doc_no) is required in request body'
    });
  }

  const customerNo = customer.padStart(10, '0');
  console.log('🔵 [1] Fetching PDF for CustomerNo:', customerNo);

  const soapEnvelope = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZINV_AKG_FM>
         <CUSTOMER>${customerNo}</CUSTOMER>
         <DOCUMENT_NO>${doc_no}</DOCUMENT_NO>
      </urn:ZINV_AKG_FM>
   </soapenv:Body>
</soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.INVOICE_DOWNLOAD, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': ''
      }
    });    
    
    console.log('🔵 [2] SOAP Response Status:', response.status);

    // Parse XML Response
    xml2js.parseString(response.data, {
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    }, (err, result) => {
      if (err) {
        console.error('🔴 [2] XML Parse Error:', err);
        return res.status(500).json({
          status: 'ERROR',
          message: 'Failed to parse SOAP response'
        });
      }

      try {
        const body = result.Envelope.Body;
        const responseKey = Object.keys(body)[0];
        const data = body[responseKey];

        const base64PDF = data.EV_PDF || data.EV_PDF_BASE64 || '';

        if (!base64PDF) {
          return res.status(404).json({
            status: 'ERROR',
            message: 'PDF not found in the SOAP response'
          });
        }

        const pdfBuffer = Buffer.from(base64PDF, 'base64');

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=customer_invoice_${doc_no}.pdf`,
          'Content-Length': pdfBuffer.length
        });

        return res.send(pdfBuffer);

      } catch (parseErr) {
        console.error('🔴 [3] Data extraction error:', parseErr);
        return res.status(500).json({
          status: 'ERROR',
          message: 'Failed to extract PDF from SOAP response'
        });
      }
    });

  } catch (error) {
    console.error('🔴 [4] SOAP Request Error:', error.response?.data || error.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch customer invoice PDF'
    });
  }
};

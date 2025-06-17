const axios = require('axios');
const xml2js = require('xml2js');

exports.getPaySlipData = async (req, res) => {
  try {
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

    // Make SOAP request
    const response = await axios.post(process.env.PAY_SLIP_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': ''
      }
    });

    // Parse SOAP XML to JSON
    xml2js.parseString(response.data, {
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    }, (err, result) => {
      if (err) {
        console.error('XML Parsing Error:', err);
        return res.status(500).json({ status: 'E', message: 'Failed to parse SOAP response' });
      }

      try {
        const body = result.Envelope.Body;
        const responseKey = Object.keys(body)[0];
        const data = body[responseKey];
        const base64PDF = data.EV_PDF_BASE64 || '';

        const rawItems = Array.isArray(data.IV_EMPLOYEE_LIST?.item)
          ? data.IV_EMPLOYEE_LIST.item
          : data.IV_EMPLOYEE_LIST?.item
            ? [data.IV_EMPLOYEE_LIST.item]
            : [];

        // ✅ Properly map with user-friendly keys
        const mappedItems = rawItems.map(item => ({
          "Employee ID": item.EMPLOYEE_ID || '',
          "Employee Name": item.EMPLOYEE_NAME || '',
          "Designation": item.DESIGNATION || '',
          "Organizational Unit": item.ORG_UNIT || '',
          "Personnel Area": item.PERSONNEL_AREA || '',
          "Personnel Sub Area": item.PERSONNEL_SUB_AREA || '',
          "Employee Group": item.EMPLOYEE_GROUP || '',
          "Company Code": item.COMPANY_CODE || '',
          "Payroll Year": item.PAYROLL_YEAR || '',
          "Payroll Month": item.PAYROLL_MONTH || '',
          "Wage Type": item.WAGE_TYPE_CODE || '',
          "Earnings Amount": item.WAGE_TYPE_AMT || '',
          "Earnings Currency": item.WAGE_TYPE_CURR || '',
          "Earnings Description": item.WAGE_TYPE_TEXT || '',
          "Cost Centre": item.COST_CENTRE || '',
          "Bank Key": item.BANK_KEY || '',
          "Bank Account Number": item.BANK_ACC_NO || '',
          "Deduction Wage": item.WAGE_TYPE_CODED || '',
          "Deduction Amount": item.WAGE_TYPE_AMTD || '',
          "Deduction Description": item.WAGE_TYPE_TEXTD || ''
        }));

        // ✅ Handle PDF download if requested
        if (req.query.download === 'true') {
          if (!base64PDF) return res.status(404).send('PDF not available');
          const buffer = Buffer.from(base64PDF, 'base64');
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=payslip.pdf');
          return res.send(buffer);
        }

        // ✅ Return JSON response with mapped data
        return res.json({
          status: 'S',
          data: mappedItems,
          pdfBase64: base64PDF
        });

      } catch (parseErr) {
        console.error('Data Extraction Error:', parseErr);
        return res.status(500).json({ status: 'E', message: 'Data extraction failed' });
      }
    });

  } catch (error) {
    console.error('SOAP Request Error:', error.message);
    return res.status(500).json({ status: 'E', message: 'Failed to fetch pay slip data' });
  }
};





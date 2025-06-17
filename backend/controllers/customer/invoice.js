const axios = require('axios');
const xml2js = require('xml2js');

exports.getInvoiceData = async (req, res) => {
  let customer_id = req.body.username?.trim();

  if (!customer_id) {
    return res.status(400).json({
      status: 'E',
      message: 'Username (customer_id) is required'
    });
  }

  customer_id = customer_id.padStart(10, '0');

  const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZINV_AKG_FM>
          <CUSTOMER>${customer_id}</CUSTOMER>
        </urn:ZINV_AKG_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.INVOICE_DATA_URL, soapEnvelope, {
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

        const rawItems = Array.isArray(data.ET_INVOICE_LIST?.item)
          ? data.ET_INVOICE_LIST.item
          : data.ET_INVOICE_LIST?.item ? [data.ET_INVOICE_LIST.item] : [];

        // ✅ Map each raw item to descriptive keys
        const invoiceItems = rawItems.map(item => ({
          "Billed Document": item.BILLED_DOCUMENT || '',
          "Billing Type": item.BILLING_TYPE || '',
          "Billing Date": item.BILLING_DATE || '',
          "Customer": item.CUSTOMER || '',
          "Sales Organization": item.SALES_ORG || '',
          "Division": item.DIVISION || '',
          "Company Code": item.COMPANY_CODE || '',
          "Item Number": item.ITEM_NUMBER || '',
          "Description": item.DESCRIPTION || '',
          "Billed Quantity": item.BILLED_QUANTITY || '',
          "Sales Unit": item.SALES_UNIT || '',
          "Exchange Rate": item.EXCHANGE_RATE || '',
          "Reference Document Number": item.REF_DOC_NO || '',
          "Item Number of Ref Doc": item.ITEM_NO_REF_DOC || '',
          "Vendor Number": item.VENDOR_NUMBER || '',
          "Payment Key": item.PAYMENT_KEY || '',
          "Purchase Order": item.PURCHASE_ORDER || '',
          "Material Number": item.MATERIAL_NUMBER || '',
          "Net Price": item.NET_PRICE || '',
          "Plant": item.PLANT || '',
          "Storage Location": item.STORAGE_LOC || '',
          "Posting Date": item.POSTING_DATE || '',
          "Stock Transfer": item.STOCK_TRANSFER || '',
          "Goods Recipient": item.GOODS_RECIPT || '',
          "Currency Key": item.CURRENCY_KEY || '',
          "Customer Address": item.CUSTOMER_ADDRESS || ''
        }));

        // ✅ If download=true, stream PDF
        if (req.query.download === 'true') {
          if (!base64PDF) return res.status(404).send('PDF not available');
          const buffer = Buffer.from(base64PDF, 'base64');
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
          return res.send(buffer);
        }

        // ✅ Else, send JSON with detailed items and PDF base64
        return res.json({
          status: 'S',
          data: invoiceItems,
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

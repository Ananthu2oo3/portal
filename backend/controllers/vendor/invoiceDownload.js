const axios = require('axios');

exports.downloadVendorInvoice = async (req, res) => {
  const vendor = req.body.username;
  const doc_no = req.body.doc_no;
  // const vendor = req.body["Vendor Number"]
  // const doc_no = req.body["Document Number"]

  if (!vendor) {
    return res.status(400).json({ status: 'ERROR', message: 'Username (vendor) is required in request body' });
  }

  if (!doc_no) {
    return res.status(400).json({ status: 'ERROR', message: 'Document Number (doc_no) is required in request body' });
  }

  const vendorNo = vendor.padStart(10, '0');
  console.log('🔵 [1] Fetching PDF for VendorNo:', vendorNo);

  const url = `${process.env.INVOICE_DOWNLOAD_URL}(DocNo='${doc_no}',VendorNo='${vendorNo}')/$value`;

  const headers = {
    'Accept': 'application/pdf', // Expecting PDF
    'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
    'Cookie': 'sap-usercontext=sap-client=100'
  };

  try {
    const response = await axios.get(url, {
      headers,
      responseType: 'arraybuffer', // Important for binary response like PDF
      maxBodyLength: Infinity
    });

    console.log('🟢 [2] PDF Retrieved Successfully');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice_${doc_no}.pdf`,
      'Content-Length': response.data.length
    });

    res.send(response.data);

  } catch (error) {
    console.error('🔴 [3] Error retrieving PDF:', error.response?.data || error.message);
    res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve PDF invoice' });
  }
};

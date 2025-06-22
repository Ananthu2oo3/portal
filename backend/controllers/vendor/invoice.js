const axios = require('axios');

exports.getVendorInvoice = async (req, res) => {
  const vendor = req.body.username;

  if (!vendor) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Username (vendor) is required in request body'
    });
  }

  const vendorNo = vendor.padStart(10, '0');
  console.log('🔵 [1] Fetching vendor invoice for VendorNo:', vendorNo);

  const url = `${process.env.VENDOR_INVOICE_URL}?$filter=VendorNo eq '${vendorNo}'`;

  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
    'Cookie': 'sap-usercontext=sap-client=100'
  };

  try {
    const response = await axios.get(url, {
      headers,
      maxBodyLength: Infinity
    });

    console.log('🟢 [2] Vendor invoice data retrieved');

    const invoiceData = response.data?.d?.results || [];

    const formatSAPDate = (sapDate) => {
      const timestamp = parseInt(sapDate?.match(/\d+/)?.[0] || '0');
      return timestamp ? new Date(timestamp).toISOString().split('T')[0] : '';
    };

    const cleanedData = invoiceData.map(entry => ({
      // "Vendor Number": entry.VendorNo || '',
      // "Vendor Name": entry.VendorName || '',
      "Vendor Address": entry.VendorAddress || '',
      "Document Number": entry.DocNo || '',
      "Fiscal Year": entry.FiscalYear || '',
      "Document Date": formatSAPDate(entry.DocDate),
      "Posting Date": formatSAPDate(entry.PostingDate),
      "Account Entry Date": formatSAPDate(entry.AccEntDate),
      "Baseline Date": formatSAPDate(entry.BaselineDate),
      "Company Code": entry.CompanyCode || '',
      "Currency": entry.CurrKey || '',
      "Document Item": entry.DocItem || '',
      "PO Number": entry.PoNo || '',
      "PO Item": entry.ItemNo || '',
      "Material Number": entry.MaterialNumber || '',
      "Amount": entry.AmntDocCurr || '',
      "Quantity": entry.Quantity || '',
      "Unit of Measure": entry.UnitMeasure || '',
      "Net Price": entry.NetPrice || '',
      // "Division": entry.Division || '',
      "Description": entry.Description || '',
      // "Goods Receipt": entry.GoodsReceipt || ''
    }));

    res.json({ status: 'SUCCESS', data: cleanedData });

  } catch (error) {
    console.error('🔴 [3] Error retrieving vendor invoice:', error.response?.data || error.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve vendor invoice data'
    });
  }
};

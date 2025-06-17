const axios = require('axios');

exports.getRequestQuotation = async (req, res) => {
  const vendor = req.body.username;

  if (!vendor) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Username (vendor) is required in request body'
    });
  }

  const vendorNo = vendor.padStart(10, '0');
  console.log('🔵 [1] Fetching quotation request for VendorNo:', vendorNo);

  const url = `${process.env.QUOTATION_REQUEST}?$filter=VendorNo eq '${vendorNo}'`;

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

    console.log('🟢 [2] Quotation request data retrieved');

    const quotationRequest = response.data?.d?.results || [];

    // 🧹 Clean and map to user-friendly keys
    const formatSAPDate = (sapDate) => {
      const timestamp = parseInt(sapDate?.match(/\d+/)?.[0] || '0');
      return timestamp ? new Date(timestamp).toISOString().split('T')[0] : '';
    };

    const mappedData = quotationRequest.map(entry => ({
      "RFQ Number": entry.RfqNumber || '',
      "Document Type": entry.DocType || '',
      "Vendor Number": entry.VendorNo || '',
      "Purchase Organization": entry.PurchaseOrg || '',
      "Purchase Group": entry.PurchaseGrp || '',
      "Document Date": formatSAPDate(entry.DocDate),
      "Created By": entry.CreatedBy || '',
      "Item Number": entry.ItemNo || '',
      "Material Number": entry.MatNo || '',
      "Short Text": entry.ShortText || '',
      "Quantity": entry.Quantity || '',
      "Unit of Measure": entry.UnitMeasure || '',
      "Net Price": entry.NetPrice || '',
      "Delivery Date": formatSAPDate(entry.DeliveryDate),
      "Currency": entry.Currency || ''
    }));

    res.json({ status: 'SUCCESS', data: mappedData });

  } catch (error) {
    console.error('🔴 [3] Error retrieving quotation request:', error.response?.data || error.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve quotation request data'
    });
  }
};

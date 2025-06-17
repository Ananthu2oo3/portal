const axios = require('axios');

exports.getPurchaseOrder = async (req, res) => {
  const vendor = req.body.username;

  if (!vendor) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Username (vendor) is required in request body'
    });
  }

  const vendorNo = vendor.padStart(10, '0');
  console.log('🔵 [1] Fetching purchase order for VendorNo:', vendorNo);

  const url = `${process.env.PURCHASE_ORDER_URL}?$filter=VendorNo eq '${vendorNo}'`;

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

    console.log('🟢 [2] Purchase order data retrieved');

    const purchaseOrders = response.data?.d?.results || [];

    // 🧹 Clean and map to user-friendly keys
    const formatSAPDate = (sapDate) => {
      const timestamp = parseInt(sapDate?.match(/\d+/)?.[0] || '0');
      return timestamp ? new Date(timestamp).toISOString().split('T')[0] : '';
    };

    const mappedData = purchaseOrders.map(entry => ({
      "PO Number": entry.PoNumber || '',
      "Document Type": entry.DocType || '',
      "Vendor Number": entry.VendorNo || '',
      "Purchase Organization": entry.PurchaseOrg || '',
      "Purchase Group": entry.PurchaseGrp || '',
      "Document Date": formatSAPDate(entry.DocDate),
      "Created By": entry.CreatedBy || '',
      "Currency": entry.Currency || '',
      "Item Number": entry.ItemNo || '',
      "Material Number": entry.MatNo || '',
      "Short Text": entry.ShortText || '',
      "Quantity": entry.Quantity || '',
      "Unit of Measure": entry.UnitMeasure || '',
      "Net Price": entry.NetPrice || '',
      "Plant": entry.Plant || '',
      "Delivery Date": formatSAPDate(entry.DeliveryDate),
      "Item Category": entry.ItemCategory || '',
      "Document Category": entry.DocCategory || ''
    }));

    res.json({ status: 'SUCCESS', data: mappedData });

  } catch (error) {
    console.error('🔴 [3] Error retrieving purchase order data:', error.response?.data || error.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve purchase order data'
    });
  }
};

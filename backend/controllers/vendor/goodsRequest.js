const axios = require('axios');

exports.getGoodsReceipt = async (req, res) => {
  const vendor = req.body.username;

  if (!vendor) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'VendorNo is required in request body'
    });
  }

  const vendorNo = vendor.padStart(10, '0');
  console.log('🔵 [1] Fetching goods receipt for VendorNo:', vendorNo);

  // ✅ Fixed filter syntax: eq 'value'
  const url = `${process.env.GOODS_RECEIPT_URL}?$filter=VendorNo eq '${vendorNo}'`;

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

    console.log('🟢 [2] Goods receipt data retrieved');

    const goodsData = response.data?.d?.results || [];

    const formatSAPDate = (sapDate) => {
      const timestamp = parseInt(sapDate?.match(/\d+/)?.[0] || '0');
      return timestamp ? new Date(timestamp).toISOString().split('T')[0] : '';
    };

    // 🗂️ Map to detailed readable keys
    const mappedData = goodsData.map(entry => ({
      "Document Number": entry.MatDocNo || '',
      // "Document Year": entry.DocYear || '',
      "Posting Date": formatSAPDate(entry.PostDate),
      "Document Date": formatSAPDate(entry.DocDate),
      "Document Type": entry.DocType || '',
      "Created By": entry.CreatedBy || '',
      "Item Number": entry.ItemNo || '',
      "PO Number": entry.PoNumber || '',
      "PO Item": entry.PoItem || '',
      "Movement Type": entry.MoveType || '',
      "Quantity": entry.Quantity || '',
      "Unit of Measure": entry.UnitMeasure || '',
      "Plant": entry.Plant || '',
      "Storage Location": entry.StorageLoc || '',
      "Material Number": entry.MatNo || '',
      // "Vendor Number": entry.VendorNo || ''
    }));

    res.json({ status: 'SUCCESS', data: mappedData });

  } catch (error) {
    console.error('🔴 [3] Error retrieving goods receipt:', error.response?.data || error.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve goods receipt data'
    });
  }
};

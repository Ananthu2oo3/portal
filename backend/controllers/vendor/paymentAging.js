const axios = require('axios');

exports.getPaymentAging = async (req, res) => {
  const vendor = req.body.username;

  if (!vendor) {
    return res.status(400).json({ status: 'ERROR', message: 'Username (vendor) is required in request body' });
  }

  const vendorNo = vendor.padStart(10, '0');
  console.log('🔵 [1] Fetching data for VendorNo:', vendorNo);

  const url = `${process.env.VENDOR_PAYMENT_URL}?$filter=VendorNo eq '${vendorNo}'`;

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

    console.log('🟢 [2] Data retrieved');

    const quotationRequest = response.data?.d?.results || [];

    // 🧹 Clean the data by removing __metadata and formatting dates
    const cleanedData = quotationRequest.map(entry => {
      const { __metadata, ...rest } = entry;

      const formatSAPDate = (sapDate) => {
        const timestamp = parseInt(sapDate?.match(/\d+/)?.[0] || '0');
        return timestamp ? new Date(timestamp).toISOString().split('T')[0] : null;
      };

      return {
        ...rest,
        PostDate: formatSAPDate(rest.PostDate),
        DocDate: formatSAPDate(rest.DocDate)
      };
    });

    res.json({ status: 'SUCCESS', data: cleanedData });

  } catch (error) {
    console.error('🔴 [3] Error retrieving data:', error.response?.data || error.message);
    res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve data' });
  }
};

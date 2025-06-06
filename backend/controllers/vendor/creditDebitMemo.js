const axios = require('axios');

exports.getCreditDebitMemo = async (req, res) => {
  const vendorNo = req.body.username;
  

  if (!vendorNo) {
    return res.status(400).json({ status: 'ERROR', message: 'VendorNo is required as a query parameter' });
  }

  console.log('🔵 [1] Fetching data for VendorNo:', vendorNo);

  const url = `${process.env.CREDIT_DEBIT_MEMO}?$filter=VendorNo eq'${vendorNo}'`;


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

    console.log('🟢 [2] data retrieved');

    const goodsData = response.data?.d?.results || [];

    // 🧹 Clean the data by removing __metadata and formatting dates
    const cleanedData = goodsData.map(entry => {
      const { __metadata, ...rest } = entry;

      // Optional: Convert SAP date string to readable format
      const formatSAPDate = (sapDate) => {
        const timestamp = parseInt(sapDate?.match(/\d+/)?.[0] || '0');
        return new Date(timestamp).toISOString().split('T')[0]; 
      };

      return {
        ...rest,
        PostDate: formatSAPDate(rest.PostDate),
        DocDate: formatSAPDate(rest.DocDate)
      };
    });

    res.json({ status: 'SUCCESS', data: cleanedData });

  } catch (error) {
    console.error('🔴 [3] Error retrieving data:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve data' });
  }
};

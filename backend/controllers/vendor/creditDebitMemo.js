const axios = require('axios');

exports.getCreditDebitMemo = async (req, res) => {
  const vendorNo = req.body.username;

  if (!vendorNo) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'VendorNo is required in request body'
    });
  }

  console.log('🔵 [1] Fetching data for VendorNo:', vendorNo);

  const url = `${process.env.CREDIT_DEBIT_MEMO}?$filter=VendorNo eq '${vendorNo}'`;

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

    const creditDebitData = response.data?.d?.results || [];

    // Helper: Format SAP date string to YYYY-MM-DD
    const formatSAPDate = (sapDate) => {
      const timestamp = parseInt(sapDate?.match(/\d+/)?.[0] || '0');
      return timestamp ? new Date(timestamp).toISOString().split('T')[0] : null;
    };

    // ✅ Map to user-friendly keys
    const mappedData = creditDebitData.map(entry => ({
      "Document Number": entry.DocNo || '',
      "Company Code": entry.CompanyCode || '',
      "Fiscal Year": entry.FiscalYear || '',
      "Line Item Number": entry.NoLineItem || '',
      "Posting Key": entry.PostingKey || '',
      "Debit/Credit Indicator": entry.DebitCreditIndicator || '',
      "Amount (Local Currency)": entry.AmntLocalCurrency || '',
      "Amount (Document Currency)": entry.AmntDocCurrency || '',
      "Assignment Number": entry.AssignNo || '',
      "Document Type": entry.DocType || '',
      "Document Date": formatSAPDate(entry.DocDate),
      "Posting Date": formatSAPDate(entry.PostingDate),
      "Transaction Code": entry.Tcode || '',
      "Currency": entry.CurrencyKey || ''
    }));

    res.json({ status: 'SUCCESS', data: mappedData });

  } catch (error) {
    console.error('🔴 [3] Error retrieving data:', error.response ? error.response.data : error.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve data'
    });
  }
};

// const axios = require('axios');

// exports.getInquiryData = async (req, res) => {

//   const customer_id = req.body.username?.trim();

//   if (!customer_id) {
//     return res.status(400).json({
//       status: 'E',
//       message: 'Username (customer_id) is required'
//     });
//   }

//   console.log('📥 Received customer_id:', customer_id);

//   const soapEnvelope = `
//   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
//                     xmlns:urn="urn:sap-com:document:sap:rfc:functions">
//      <soapenv:Header/>
//      <soapenv:Body>
//         <urn:ZIN_CUST_AKG_FM>
//            <IV_CUSTOMER_ID>${customer_id}</IV_CUSTOMER_ID>
//         </urn:ZIN_CUST_AKG_FM>
//      </soapenv:Body>
//   </soapenv:Envelope>`;

//   try {
//     const response = await axios.post(process.env.INQUIRY_URL, soapEnvelope, 
//       {
//         headers: {
//           'Content-Type': 'text/xml;charset=UTF-8',
//           'SOAPAction': '',
//           'Authorization': 'Basic ' + Buffer.from('K901436:Kichu@2003').toString('base64'),
//           'Cookie': 'sap-usercontext=sap-client=100'
//         },
//         maxBodyLength: Infinity
//       }
//     );

//     const xml = response.data;

//     const getValue = (tag) => {
//       const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
//       return match ? match[1] : '';
//     };

//     const customerData = {
//       customer_id: getValue('CUSTOMER_ID'),
//       customer_name: getValue('CUSTOMER_NAME'),
//       country: getValue('COUNTRY'),
//       city: getValue('CITY'),
//       postal_code: getValue('POSTAL_CODE'),
//       address: getValue('ADDRESS'),
//       street: getValue('STREET'),
//       bank_created_on: getValue('BANK_CREATED_ON'),
//       bank_created_by: getValue('BANK_CREATED_BY'),
//       acct_grp: getValue('ACCT_GRP'),
//       bank_name: getValue('BANNK_NAME'),
//       bank_no: getValue('BANK_NO')
//     };

//     res.json({
//       status: 'S',
//       data: customerData
//     });

//   } catch (error) {
//     console.error('❌ SOAP Error:', error.response ? error.response.data : error.message);
//     res.status(500).json({
//       status: 'E',
//       message: 'Failed to retrieve customer profile'
//     });
//   }
// };


const axios = require('axios');
const xml2js = require('xml2js');

exports.getInquiryData = async (req, res) => {
  const customer_id = req.body.username?.trim();

  if (!customer_id) {
    return res.status(400).json({
      status: 'E',
      message: 'Username (customer_id) is required'
    });
  }

  console.log('📥 Received customer_id:', customer_id);

  const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZIN_CUST_AKG_FM>
          <IV_CUSTOMER_ID>${customer_id}</IV_CUSTOMER_ID>
        </urn:ZIN_CUST_AKG_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.INQUIRY_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': ''
      }
    });

    const xml = response.data;

    // Parse the XML response
    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('❌ XML Parse Error:', err);
        return res.status(500).json({
          status: 'E',
          message: 'Failed to parse SOAP response'
        });
      }

      try {
        const items = result['soap-env:Envelope']
          ['soap-env:Body']
          ['n0:ZIN_CUST_AKG_FMResponse']
          ['ET_INQUIRY_LIST']
          ['item'];

        const itemList = Array.isArray(items) ? items : [items];

        res.json({
          status: 'S',
          data: itemList
        });
      } catch (parseError) {
        console.error('❌ Data Extract Error:', parseError);
        res.status(500).json({
          status: 'E',
          message: 'Failed to extract data from SOAP response'
        });
      }
    });

  } catch (error) {
    console.error('❌ SOAP Request Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      status: 'E',
      message: 'Failed to retrieve customer inquiry list'
    });
  }
};

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const axios = require('axios');
// const xml2js = require('xml2js');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());



// app.post('/api/login', async (req, res) => {
//   console.log('🔵 [1] Received login request');
  
//   const { username, password } = req.body;
//   console.log('🔵 [2] Extracted credentials:', { username, password });

//   const soapEnvelope = `
//     <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sap="urn:sap-com:document:sap:rfc:functions">
//       <soapenv:Header/>
//       <soapenv:Body>
//         <sap:ZCUST_AKG_FM>
//           <USERNAME>${username}</USERNAME>
//           <PASSWORD>${password}</PASSWORD>
//         </sap:ZCUST_AKG_FM>
//       </soapenv:Body>
//     </soapenv:Envelope>`;
  
//   const config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zakg_ws?sap-client=100',
//     // headers: {
//     //   'Content-Type': 'text/xml;charset=UTF-8',
//     //   'SOAPAction': '',
//     //   'Authorization': 'Basic SzkwMTQzNjpLaWNodUAyMDAz', // Replace with valid Base64
//     //   'Cookie': 'sap-usercontext=sap-client=100'
//     // },
//     headers: { 
//     'Content-Type': 'text/xml;charset=UTF-8', 
//     'SOAPAction': '', 
//     'Authorization': '••••••', 
//     'Cookie': 'sap-usercontext=sap-client=100'
//     },
//     data: soapEnvelope
//   };

//   try {
//     const response = await axios.request(config);
//     console.log('🟢 [3] SOAP request successful');

//     // Parse the XML response
//     xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
//       if (err) {
//         console.error('🔴 [4] Error parsing XML:', err);
//         return res.status(500).json({ status: 'Failed', error: 'Invalid XML response' });
//       }

//       console.log('🟢 [5] Parsed XML:', JSON.stringify(result));

//       // Example: check some result field (update this to match your SAP FM output!)
//       const returnData = result['soapenv:Envelope']['soapenv:Body']['ns0:ZCUST_AKG_FMResponse'];

//       if (returnData && returnData.STATUS === 'SUCCESS') {
//         res.json({ status: 'Success', message: 'Login successful' });
//       } else {
//         res.status(401).json({ status: 'Failed', message: 'Invalid credentials' });
//       }
//     });

//   } catch (error) {
//     console.log('🔴 [6] SOAP request failed');
//     if (error.response) {
//       console.error('🔴 [7] Error response:', error.response.status, error.response.statusText);
//       console.error('🔴 [8] Error body:', error.response.data);
//     } else {
//       console.error('🔴 [9] Error:', error.message);
//     }
//     res.status(500).json({ status: 'Failed', error: error.message });
//   }
// });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
 
const loginRoute = require('./routes/login');
 
const app = express();
app.use(cors());
app.use(bodyParser.json());
 
app.use('/api', loginRoute);
 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


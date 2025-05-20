const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config(); // Load .env file

router.post('/login', async (req, res) => {
  console.log('🔵 [1] Received login request');

  const { username, password } = req.body;
  console.log('🔵 [2] Extracted credentials:', { username, password });

  const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sap="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <sap:ZCUST_AKG_FM>
          <USERNAME>${username}</USERNAME>
          <PASSWORD>${password}</PASSWORD>
        </sap:ZCUST_AKG_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.SAP_SOAP_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64')
      },
      responseType: 'text'
    });

    console.log('SOAP Response:', response.data);
    console.log('🟢 [3] SOAP request successful');

    const statusMatch = response.data.match(/<STATUS>(.*?)<\/STATUS>/);
    const ev_status = statusMatch ? statusMatch[1] : 'E';
    res.json({ status: ev_status });

  } catch (error) {
    console.error('SAP Request Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'E', message: 'Error contacting SAP service.' });
  }
});

module.exports = router;

const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.handleLogin = async (req, res) => {
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
    const response = await axios.post(process.env.LOGIN_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64')
      },
      responseType: 'text'
    });

    console.log('SOAP Response:', response.data);
    console.log('🟢 [3] SOAP request successful');

    // Extract <STATUS> tag
    const statusMatch = response.data.match(/<STATUS>(.*?)<\/STATUS>/);
    const ev_status = statusMatch ? statusMatch[1] : 'E';

    if (ev_status === 'SUCCESS') {
      const token = jwt.sign(
        { username }, // payload
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // expiry
      );

      console.log('🟢 [4] JWT created:', token);

      // Return status + token
      return res.json({ status: ev_status, token });
    }

    // If not success => just return status
    return res.json({ status: ev_status });

  } catch (error) {
    console.error('SAP Request Error:', error.response ? error.response.data : error.message);
    return res.status(500).json({ status: 'E', message: 'Error contacting SAP service.' });
  }
};

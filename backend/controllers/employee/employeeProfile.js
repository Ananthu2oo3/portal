const axios = require('axios');
const xml2js = require('xml2js');

exports.getEmployeeProfile = async (req, res) => {
  const username = req.body.username;

  if (!username) {
    return res.status(400).json({
      status: 'E',
      message: 'Username (username) is required'
    });
  }

  console.log('📥 Received employee ID:', username);

  const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sap="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <sap:ZEMP_AKG_FM>
          <IV_EMPLOYEE_ID>${username}</IV_EMPLOYEE_ID>
        </sap:ZEMP_AKG_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.EMPLOYEE_PROFILE_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': '',
        'Cookie': 'sap-usercontext=sap-client=100'
      }
    });

    const xml = response.data;
    // console.log('📤 SOAP Response:', xml);

    const parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix], // removes soap-env:, n0:, etc.
    });

    const parsed = await parser.parseStringPromise(xml);

    const employeeItem = parsed.Envelope?.Body?.ZEMP_AKG_FMResponse?.ET_EMPLOYEE_PROFILE?.item;

    if (!employeeItem) {
      return res.status(404).json({ status: 'E', message: 'Employee not found' });
    }

    const employeeData = {
      employee_id: employeeItem.EMPLOYEE_ID,
      first_name: employeeItem.FIRST_NAME,
      last_name: employeeItem.LAST_NAME,
      dob: employeeItem.DOB,
      nationality: employeeItem.NATIONALITY,
      city: employeeItem.CITY,
      country: employeeItem.COUNTRY,
      email: employeeItem.EMAIL_ID,
      employee_job: employeeItem.EMPLOYEE_JOB,
      employee_role: employeeItem.EMPLOYEE_ROLE,
      employee_position: employeeItem.EMPLOYEE_POSITION,
      employee_group: employeeItem.EMPLOYEE_GROUP,
      personnel_sub_area: employeeItem.PERSONNEL_SUB_AREA,
      company_code: employeeItem.COMPANY_CODE,
      organization_unit: employeeItem.ORGANIZATION_UNIT,
      payroll_area: employeeItem.PAYROLL_AREA
    };

    res.json({ status: 'S', data: employeeData });

  } catch (error) {
    console.error('❌ SOAP Error:', error.response?.data || error.message);
    res.status(500).json({
      status: 'E',
      message: 'Failed to retrieve employee profile'
    });
  }
};
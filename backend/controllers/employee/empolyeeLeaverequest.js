const axios = require('axios');
const xml2js = require('xml2js');

exports.getEmployeeLeaveRequest = async (req, res) => {
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
        <sap:ZELR_AKG_FM>
          <IV_EMPLOYEE_ID>${username}</IV_EMPLOYEE_ID>
        </sap:ZELR_AKG_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post(process.env.LEAVE_REQUEST_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64'),
        'SOAPAction': '',
        'Cookie': 'sap-usercontext=sap-client=100'
      }
    });

    const xml = response.data;

    const parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    });

    const parsed = await parser.parseStringPromise(xml);

    let employeeItems = parsed.Envelope?.Body?.ZELR_AKG_FMResponse?.ET_EMPLOYEE_PROFILE?.item;

    // 🔑 Normalize to array
    if (!employeeItems) {
      return res.status(404).json({ status: 'E', message: 'Employee leave requests not found' });
    }
    if (!Array.isArray(employeeItems)) {
      employeeItems = [employeeItems]; // if only 1 item, wrap in array
    }

    console.log('📄 Parsed Employee Items:', employeeItems);

    // 🔑 Map each leave record to your desired format
    const leaveRequestData = employeeItems.map(item => ({
      "Employee ID": item.EMPLOYEE_ID || '',
      "Leave Start Date": item.START_DATE || '',
      "Leave End Date": item.END_DATE || '',
      // "Start Time": item.START_TIME || '',
      // "End Time": item.END_TIME || '',
      "Absence Type Code": item.ABSENT_TYPE || '',
      "Days on Leave": item.DAYS_ON_LEAVE || '',
      "Absence Hours": item.ABSENSE_HOUR || '',
      "Payroll Days": item.PAYROLL_DAYS || '',
      "Payroll Hours": item.PAYROLL_HOUR || '',
      "Calendar Days": item.CALENDER_DAYS || '',
      // "Document Number": item.DOC_NO || '',
      "Absence Quota Type": item.ABSENT_QUOTA_TYPE || '',
      // "Counter for Time": item.COUNTER_FOR_TIME || '',
      "Start Date for Quota": item.START_DATE_FOR_QUOTA || '',
      "Quota Deduction Date": item.QUOTA_DEDUCTION || ''
    }));

    res.json({ status: 'S', data: leaveRequestData });

  } catch (error) {
    console.error('❌ SOAP Error:', error.response?.data || error.message);
    res.status(500).json({
      status: 'E',
      message: 'Failed to retrieve employee leave requests'
    });
  }
};

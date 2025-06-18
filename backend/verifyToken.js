const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

exports.generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

exports.verifyToken = (req, res, next) => {

  const openPaths = [
    '/api/customer-login',
    '/api/vendor-login',
    '/api/employee-login'
  ];

  if (openPaths.includes(req.originalUrl)) {
    return next(); 
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'E', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Verify token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 'E', message: 'Invalid or expired token' });
    }
    req.user = decoded; // Store decoded data for later use
    next();
  });
};

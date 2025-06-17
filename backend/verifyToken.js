// verifyToken.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

// Utility to create a token (can use in your login controller)
exports.generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Middleware to verify the token on protected routes
exports.verifyToken = (req, res, next) => {
  // Define routes that do NOT require auth
  const openPaths = [
    '/api/customer-login',
    '/api/vendor-login',
    '/api/employee-login'
  ];

  if (openPaths.includes(req.originalUrl)) {
    return next(); // skip auth check
  }

  // Check Authorization header
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

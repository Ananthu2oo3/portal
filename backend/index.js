// const express   = require('express');
// const cors      = require('cors');
// const session   = require('express-session');
// const bodyParser = require('body-parser');

// require('dotenv').config();

// const Route = require('./routes/customerPortal');

// const app = express();
// app.use(cors({
//   origin: 'http://localhost:4200',
//   methods: ['GET', 'POST'],
//   credentials: true
// }));

// app.use(bodyParser.json());


// app.use(session({
//   secret: 'your_secret',
//   resave: false,
//   saveUninitialized: true,
// }));

// // Routes
// app.use('/api', Route);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const Route = require('./routes/portalRoutes');
const { verifyToken } = require('./verifyToken');  // ✅ correct destructuring!

const app = express();

// CORS config
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Parse JSON bodies
app.use(bodyParser.json());

// Apply JWT middleware to all /api routes
app.use('/api', verifyToken, Route);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

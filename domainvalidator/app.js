const express = require('express');
const cors = require('cors');
const app = express();
const port = 3200;

// Predefined list of domains to check against
const allowedDomains = ['yopmail.com','umd.edu', 'uva.edu'];

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin (your React app)
  methods: ['GET', 'POST'], // Allow only GET and POST requests
  allowedHeaders: ['Content-Type'] // Allow only Content-Type header
}));

// Endpoint to check email domain
app.post('/check-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailDomain = email.split('@')[1];

  if (!emailDomain) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const isDomainAllowed = allowedDomains.includes(emailDomain);
  res.json({ isDomainAllowed });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

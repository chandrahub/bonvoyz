const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3100;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin (your React app)
    methods: ['GET', 'POST'], // Allow only GET and POST requests
    allowedHeaders: ['Content-Type'] // Allow only Content-Type header
}));

// API endpoint for sending emails
app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    // Create a Nodemailer transporter object
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'codefestmarriott@gmail.com', // Your Gmail email address
            pass: 'abcddummy' // Your Gmail password or app-specific password if 2FA is enabled
        }
    });

    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'codefestmarriott@gmail.com',
            to: to,
            subject: subject,
            text: text
        });

        console.log('Message sent: %s', info.messageId);
        res.send('Email sent successfully!');
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Failed to send email');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

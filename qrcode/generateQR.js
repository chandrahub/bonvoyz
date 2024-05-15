const fs = require('fs');
const qr = require('qrcode');

// Data to encode in the QR code
//const data = 'https://marriottbonvoycodefest2.com';
const data = 'http://localhost:3000';

// Options for the QR code
const options = {
    type: 'png',
    margin: 2,
    color: {
        dark: '#000', // Dark color
        light: '#FFF' // Light color
    }
};

// Generate QR code
qr.toFile('./qr-code.png', data, options, (err) => {
    if (err) throw err;
    console.log('QR code generated successfully');
});

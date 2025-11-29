// 1. LOAD SECRETS (Must be the first line!)
require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 2. SETUP TWILIO CLIENT
// Notice we don't type the password here. We pull it from the hidden file.
const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID, 
    process.env.TWILIO_AUTH_TOKEN
);

// 3. THE ROUTE
app.post('/send-sms', (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: "Missing number or message" });
    }

    console.log(`Attempting to send to ${to}...`);

    client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio Number
        to: to // The number you typed in the frontend
    })
    .then((msg) => {
        console.log("Success! SID:", msg.sid);
        res.json({ success: true, sid: msg.sid });
    })
    .catch((err) => {
        console.error("Error:", err);
        res.status(500).json({ success: false, error: err.message });
    });
});

// 4. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 SMS Server running on port ${PORT}`));
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const africastalking = require('africastalking');
const config = require('../config'); // Adjust the path if needed

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Africa's Talking SDK
const at = africastalking(config);

// Mock database for user balances (for demonstration purposes)
const userBalances = {
    '+254757909044': 100, // Example user with a balance of $100
    // Add more users as needed
};

// USSD endpoint
app.post('/ussd', (req, res) => {
    console.log('Received USSD Request:', req.body); // Log incoming request body
    const { text, sessionId, phoneNumber } = req.body;
    let response = '';

    if (!text) {
        // Initial menu
        response = 'CON Welcome to My USSD App\n';
        response += '1. Check Balance\n';
        response += '2. Buy Airtime\n';
    } else if (text === '1') {
        // Option 1: Check Balance
        const balance = userBalances[phoneNumber] || 0; // Fetch balance from the mock database
        response = `END Your balance is $${balance}`;
    } else if (text === '2') {
        // Option 2: Prompt to buy airtime
        response = 'CON Enter amount to buy airtime:';
    } else if (text.startsWith('2*')) {
        // Handle airtime purchase
        const amount = parseFloat(text.split('*')[1]);
        if (isNaN(amount) || amount <= 0) {
            response = 'END Invalid amount. Please enter a valid number.';
        } else {
            // Simulate airtime purchase success
            response = `END You have purchased airtime worth $${amount}`;
            // Update user balance
            userBalances[phoneNumber] = (userBalances[phoneNumber] || 0) - amount; // Deduct the amount from user's balance
        }
    } else {
        // Handle invalid input
        response = 'END Invalid option. Please try again.';
    }

    // Send response as plain text
    res.set('Content-Type', 'text/plain');
    res.send(response);
});

module.exports = app; // Export the app for Vercel

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection (placeholder)
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

const PORT = process.env.PORT || 3001;

// Crop Analysis Endpoint
app.post('/api/analyze-crop', async (req, res) => {
    try {
        const farmerData = req.body;
        
        // Forward request to Python ML model API
        // Update URL based on where the Flask API is running
        const mlApiUrl = process.env.ML_API_URL || 'http://localhost:5000/api/predict';
        
        const response = await axios.post(mlApiUrl, farmerData);
        
        // Send back the prediction from ML model
        res.json(response.data);
    } catch (error) {
        console.error("Error communicating with ML Model:", error.message);
        res.status(500).json({ error: 'Failed to analyze crop data', details: error.message });
    }
});

// Mock Weather API endpoint for frontend use
app.get('/api/weather', (req, res) => {
    const { lat, lon } = req.query;
    res.json({
        current: {
            temp: 28,
            condition: 'Sunny',
            humidity: 65,
        },
        forecast: [
            { day: 'Tomorrow', temp: 29, condition: 'Partly Cloudy' },
            { day: 'Day 2', temp: 27, condition: 'Rainy' },
        ]
    });
});

const Crop = require('./models/Crop');
const Task = require('./models/Task');

// MongoDB connection
let isDbConnected = false;
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => {
          console.log('✅ MongoDB Connected Successfully');
          isDbConnected = true;
      })
      .catch(err => console.log('❌ MongoDB Connection Error:', err));
} else {
    console.log('⚠️ No MONGODB_URI provided. Falling back to local in-memory storage.');
}

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "raitabandhu_secret_key_2026";
let otpStore = {}; // Temporary memory store for OTPs

// --- Authentication Endpoints ---

// Send OTP
app.post('/api/auth/send-otp', (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length < 10) return res.status(400).json({ error: "Invalid phone number" });

    // Generate a fixed OTP for easy testing, or random for prod
    const otp = "1234"; // In reality: Math.floor(1000 + Math.random() * 9000).toString()
    otpStore[phone] = otp;
    
    // In production, you would call Twilio or Fast2SMS API here to send the OTP
    console.log(`[SMS MOCK] Sent OTP ${otp} to phone number ${phone}`);
    
    res.json({ status: "success", message: "OTP sent successfully" });
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    
    if (otpStore[phone] && otpStore[phone] === otp) {
        // Correct OTP
        delete otpStore[phone]; // Clear it
        
        // Generate Token
        const token = jwt.sign({ phone }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ status: "success", token, message: "Login successful" });
    } else {
        res.status(401).json({ error: "Invalid OTP" });
    }
});

// --- Local Memory Database Fallback ---
let myDashboardData = {
    crops: [
        { id: 1, name: "Rose", datePlanted: "20 May 2024", progress: 40, emoji: "🌸" }
    ],
    tasks: [
        { id: 1, name: "Watering", status: "Due Today", type: "water" },
        { id: 2, name: "Fertilizer", status: "After 5 Days", type: "fertilizer" },
        { id: 3, name: "Pest Control", status: "After 10 Days", type: "pest" }
    ]
};

// Get Dashboard Data
app.get('/api/dashboard', async (req, res) => {
    if (isDbConnected) {
        try {
            const crops = await Crop.find();
            const tasks = await Task.find();
            res.json({ crops, tasks });
        } catch (error) {
            res.status(500).json({ error: "Database error" });
        }
    } else {
        res.json(myDashboardData);
    }
});

// Add Crop to Dashboard
app.post('/api/dashboard/crops', async (req, res) => {
    const cropName = req.body.name || "Unknown Crop";
    const cropEmoji = req.body.emoji || "🌱";
    const plantedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    if (isDbConnected) {
        try {
            const newCrop = new Crop({ name: cropName, emoji: cropEmoji, datePlanted: plantedDate });
            await newCrop.save();
            
            await Task.create([
                { name: `Watering (${cropName})`, status: "Due Today", type: "water" },
                { name: `Fertilizer (${cropName})`, status: "After 15 Days", type: "fertilizer" }
            ]);
            res.json({ status: "success", crop: newCrop });
        } catch (error) {
            res.status(500).json({ error: "Database error" });
        }
    } else {
        const newCrop = { id: Date.now(), name: cropName, datePlanted: plantedDate, progress: 0, emoji: cropEmoji };
        myDashboardData.crops.push(newCrop);
        myDashboardData.tasks.push({ id: Date.now()+1, name: `Watering (${cropName})`, status: "Due Today", type: "water" });
        myDashboardData.tasks.push({ id: Date.now()+2, name: `Fertilizer (${cropName})`, status: "After 15 Days", type: "fertilizer" });
        res.json({ status: "success", crop: newCrop });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});

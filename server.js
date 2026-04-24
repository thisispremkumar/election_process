const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();

// Initialize Gemini Client
let ai;
if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
    console.warn("GEMINI_API_KEY not found in .env. Assistant will be disabled or return mock responses.");
}

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:"]
        }
    }
}));
app.use(cors());
app.use(express.json());

// Rate Limiter to prevent abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});

app.use(express.static(__dirname));

/**
 * @route POST /api/chat
 * @desc Generate an AI response for election-related questions
 * @access Public
 */
app.post('/api/chat', apiLimiter, async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!ai) {
             return res.status(503).json({ error: 'AI Assistant is currently unavailable. Please check server configuration.' });
        }

        const prompt = `You are a helpful, neutral, and educational Election Assistant for the US. 
Answer this user question about the election process accurately, concisely, and neutrally. 
Do not express political bias. Use simple markdown for formatting if needed.
If the question is off-topic (not about elections, voting, or government), politely decline.
User Question: ${message}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ answer: response.text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: 'Failed to generate response. Please try again.' });
    }
});

const PORT = process.env.PORT || 3000;

// Export for testing, only listen if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;

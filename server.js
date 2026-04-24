const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { VertexAI } = require('@google-cloud/vertexai');

const app = express();

// Initialize Vertex AI Client
let vertexAI;
let generativeModel;

try {
    // Project ID and location should preferably come from env, defaulting for this specific project
    const project = process.env.GOOGLE_CLOUD_PROJECT || 'election-process-494307';
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    
    vertexAI = new VertexAI({ project: project, location: location });
    generativeModel = vertexAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
    });
} catch (error) {
    console.warn("Failed to initialize Vertex AI. Assistant will be disabled or return mock responses.", error);
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

        if (!generativeModel) {
             return res.status(503).json({ error: 'AI Assistant is currently unavailable. Please check server configuration.' });
        }

        const prompt = `You are a helpful, neutral, and educational Election Assistant for the US. 
Answer this user question about the election process accurately, concisely, and neutrally. 
Do not express political bias. Use simple markdown for formatting if needed.
If the question is off-topic (not about elections, voting, or government), politely decline.
User Question: ${message}`;

        const reqBody = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        };

        const responseStream = await generativeModel.generateContent(reqBody);
        const response = await responseStream.response;

        res.json({ answer: response.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error("Vertex AI Error:", error);
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

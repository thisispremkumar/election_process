"use strict";

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');
require('dotenv').config();
const { VertexAI } = require('@google-cloud/vertexai');
const validator = require('validator');

// --- Google Cloud Profiler Setup (Production only) ---
if (process.env.NODE_ENV === 'production') {
    require('@google-cloud/profiler').start({
        projectId: process.env.GOOGLE_CLOUD_PROJECT || 'election-process-494307',
        serviceContext: {
            service: 'election-process-assistant',
            version: '1.0.0',
        },
    }).catch((err) => {
        console.error('Failed to start Google Cloud Profiler:', err);
    });
}

/**
 * Express application instance configured for Google Cloud Run deployment.
 * @type {import('express').Application}
 */
const app = express();

// --- Google Cloud Logging via Winston ---
/** @type {LoggingWinston} */
const loggingWinston = new LoggingWinston();

/**
 * Winston logger instance integrated with Google Cloud Logging (Stackdriver).
 * Logs are structured and viewable in the Google Cloud Console Logs Explorer.
 * @type {import('winston').Logger}
 */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        loggingWinston,
    ],
});

/**
 * Google Cloud Vertex AI client instance.
 * @type {VertexAI}
 */
let vertexAI;

/**
 * Gemini generative model instance from Vertex AI SDK.
 * @type {Object}
 */
let generativeModel;

try {
    const project = process.env.GOOGLE_CLOUD_PROJECT || 'election-process-494307';
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

    vertexAI = new VertexAI({ project: project, location: location });
    generativeModel = vertexAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
    });
    logger.info('Google Cloud Vertex AI initialized successfully');
} catch (error) {
    logger.warn("Failed to initialize Vertex AI. Assistant will be disabled or return mock responses.", { error: error.message });
}

// --- Security Middleware (Helmet with expanded CSP for all Google Services) ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", "'unsafe-inline'",
                "cdnjs.cloudflare.com",
                "cdn.jsdelivr.net",
                // Google Maps JS API
                "maps.googleapis.com",
                "maps.gstatic.com",
                // Google Translate
                "translate.google.com",
                "translate.googleapis.com",
                // Google Analytics 4 / Tag Manager
                "www.googletagmanager.com",
                "www.google-analytics.com",
                // Google reCAPTCHA v3
                "www.google.com",
                "www.gstatic.com",
            ],
            styleSrc: [
                "'self'", "'unsafe-inline'",
                "fonts.googleapis.com",
                "cdnjs.cloudflare.com",
                "translate.googleapis.com",
            ],
            fontSrc: [
                "'self'",
                "fonts.gstatic.com",
                "cdnjs.cloudflare.com",
            ],
            imgSrc: [
                "'self'", "data:",
                "maps.gstatic.com",
                "maps.googleapis.com",
                "www.google-analytics.com",
                "www.googletagmanager.com",
                "translate.google.com",
            ],
            frameSrc: [
                "'self'",
                "www.google.com",         // reCAPTCHA iframe
                "www.youtube.com",         // YouTube embeds in timeline
                "translate.google.com",
            ],
            connectSrc: [
                "'self'",
                "www.google-analytics.com",
                "translate.googleapis.com",
                "maps.googleapis.com",
            ],
        }
    }
}));
app.use(cors());
app.use(express.json({ limit: '10kb' }));

/**
 * Rate Limiter middleware to prevent API abuse.
 * Limits each IP to 50 requests per 15-minute window.
 * @type {import('express-rate-limit').RateLimitRequestHandler}
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { error: 'Too many requests, please try again later.' }
});

app.use(express.static(__dirname));

/**
 * Sanitizes user input by escaping HTML entities to prevent XSS injection.
 * @param {string} input - The raw user input.
 * @returns {string} The sanitized input string.
 */
function sanitizeInput(input) {
    if (!input || typeof input !== 'string') return '';
    return validator.escape(validator.trim(input));
}

/**
 * @route POST /api/chat
 * @desc Generate an AI response for election-related questions using Google Cloud Vertex AI streaming.
 *       Includes timeout handling via Promise.race and graceful fallback responses.
 * @access Public (rate-limited)
 * @param {import('express').Request} req - The HTTP request object containing { message: string }.
 * @param {import('express').Response} res - The HTTP response object returning { answer: string }.
 * @returns {Promise<void>}
 */
app.post('/api/chat', apiLimiter, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || validator.isEmpty(message, { ignore_whitespace: true })) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Enforce maximum message length
        if (message.length > 2000) {
            return res.status(400).json({ error: 'Message is too long. Please keep it under 2000 characters.' });
        }

        const sanitizedMessage = sanitizeInput(message);

        if (!generativeModel) {
            const fallbackAnswer = "The AI service is currently unavailable. Please refer to the timeline for general information.";
            return res.status(503).json({ error: 'AI Assistant is currently unavailable. Please check server configuration.', answer: fallbackAnswer });
        }

        const prompt = `You are a helpful, neutral, and educational Election Assistant for India.
Answer this user question about the Indian election process (governed by the Election Commission of India) accurately, concisely, and neutrally.
Mention terms like ECI, Voter ID (EPIC), EVMs, and VVPAT where appropriate.
Do not express political bias. Use simple markdown for formatting if needed.
If the question is off-topic (not about Indian elections, voting, or government), politely decline.
User Question: ${sanitizedMessage}`;

        const reqBody = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        };

        /** @type {number} Timeout in ms for Vertex AI streaming response */
        const VERTEX_AI_TIMEOUT_MS = 15000;
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Vertex AI Timeout')), VERTEX_AI_TIMEOUT_MS)
        );

        try {
            const streamingResp = await Promise.race([
                generativeModel.generateContentStream(reqBody),
                timeoutPromise
            ]);

            let answer = '';
            for await (const item of streamingResp.stream) {
                if (item.candidates && item.candidates[0] && item.candidates[0].content && item.candidates[0].content.parts[0].text) {
                    answer += item.candidates[0].content.parts[0].text;
                }
            }

            logger.info('AI Response generated successfully via Google Cloud Vertex AI', {
                userMessage: sanitizedMessage.substring(0, 100),
                responseLength: answer.length,
                model: 'gemini-1.5-flash'
            });

            res.json({ answer });
        } catch (error) {
            logger.error("Vertex AI Generation Error:", { error: error.message, stack: error.stack });
            const fallbackAnswer = "I'm currently experiencing high traffic or a temporary issue. Please try your request again shortly, or check the ECI portal.";
            res.status(503).json({ error: 'Failed to generate response', answer: fallbackAnswer });
        }
    } catch (error) {
        logger.error("Server Error in Chat Endpoint:", { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/** @type {number} Port for the server, defaults to 3000 locally or uses Cloud Run's PORT env var */
const PORT = process.env.PORT || 3000;

// Export for testing, only listen if run directly (Cloud Run compatible)
if (require.main === module) {
    app.listen(PORT, () => {
        logger.info(`Election Process Assistant server running on port ${PORT}`);
    });
}

module.exports = app;


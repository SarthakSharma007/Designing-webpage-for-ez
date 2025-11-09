/* Filename: server.js */

/*
  This is the Node.js server for the "EZ Labs" design.
  It serves all static files from the 'public' folder.
  It provides two API endpoints:
  1. /api/contact-us: Forwards the contact form to the Vernan backend.
  2. /api/gemini: Securely calls the Google Gemini API.
*/

const express = require('express');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config(); // Loads .env variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// --- 1. Contact Form API Endpoint ---
app.post('/api/contact-us', async (req, res) => {
  const { name, email, phone, message } = req.body;
  const vernanApiUrl = 'https://vernanbackend.ezlab.in/api/contact-us/';

  // Server-side validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const apiResponse = await fetch(vernanApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message }),
    });

    const data = await apiResponse.json();

    if (apiResponse.ok) {
      res.status(200).json(data);
    } else {
      // Forward the error message from the Vernan API
      res.status(apiResponse.status).json({ error: data.message || 'An error occurred.' });
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// --- 2. Google Gemini API Endpoint ---
app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'A prompt is required.' });
  }

  try {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const apiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error('Gemini API Error:', data);
      throw new Error(data.error?.message || 'Failed to generate content from Gemini.');
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      res.status(200).json({ text: text });
    } else {
      res.status(500).json({ error: 'Invalid response structure from Gemini API.' });
    }

  } catch (error) {
    console.error('Gemini proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- Root Route ---
// This serves your index.html file when someone visits the main URL.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
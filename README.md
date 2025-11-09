EZ Labs Project - Cinematic Dark Theme

This project is a responsive single-page website for the "EZ Labs" design, built with a Node.js backend and styled with a cinematic dark theme.

The Node.js server (using Express) serves the static HTML, CSS, and JavaScript files. It also provides two secure backend API endpoints:

/api/contact-us: Handles the contact form submission by forwarding it to the Vernan backend.

/api/gemini: Handles requests for the AI features (Idea Generator and Message Suggester) by securely calling the Google Gemini API with a hidden key.

Project Structure

/
├── public/
│   ├── index.html    (The main webpage)
│   ├── style.css     (All styles for the dark theme)
│   └── script.js     (Frontend logic for nav, form, and AI features)
│
├── .env              (Stores your secret Gemini API key)
├── package.json      (Project dependencies and scripts)
├── readme.md         (You are here)
└── server.js         (The Node.js Express server with API routes)


Setup & Installation

Install Node.js: If you don't have it, download and install Node.js from nodejs.org.

Install Dependencies: Open your terminal in the project's root folder (where package.json is) and run:

npm install


This will install express, dotenv, and node-fetch.

Add API Key:

Open the .env file.

Get your Google Gemini API key.

Paste your key into the file: GEMINI_API_KEY="YOUR_API_KEY_HERE"

How to Run the Project

Start the Server: In your terminal (in the project's root folder), run:

npm start


(This is a shortcut for node server.js).

View Your Website: Open your web browser and go to:
http://localhost:3000

You should see the complete, responsive "EZ Labs" website with the new dark theme. The contact form and both AI features will be fully functional.

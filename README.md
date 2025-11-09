<h1 align="center">🌑 EZ Labs Project - Cinematic Dark Theme</h1>

<p align="center">
  This project is a responsive single-page website for the <strong>"EZ Labs"</strong> design, built with a Node.js backend and styled with a cinematic dark theme.
</p>

<hr>

<h2>🧠 Overview</h2>
<p>
  The Node.js server (using <strong>Express</strong>) serves the static HTML, CSS, and JavaScript files. It also provides two secure backend API endpoints:
</p>

<ul>
  <li><code>/api/contact-us</code>: Handles the contact form submission by forwarding it to the Vernan backend.</li>
  <li><code>/api/gemini</code>: Handles requests for the AI features (<em>Idea Generator</em> and <em>Message Suggester</em>) by securely calling the Google Gemini API with a hidden key.</li>
</ul>

<hr>

<h2>📁 Project Structure</h2>

<pre>
/
├── public/
│   ├── index.html    (The main webpage)
│   ├── style.css     (All styles for the dark theme)
│   └── script.js     (Frontend logic for nav, form, and AI features)
│
├── .env              (Stores your secret Gemini API key)
├── .gitignore         
├── package.json      (Project dependencies and scripts)
├── readme.md         (You are here)
└── server.js         (The Node.js Express server with API routes)
</pre>

<hr>

<h2>⚙️ Setup & Installation</h2>

<ol>
  <li>
    <strong>Install Node.js</strong><br>
    If you don't have it, download and install Node.js from 
    <a href="https://nodejs.org" target="_blank">nodejs.org</a>.
  </li>

  <li>
    <strong>Install Dependencies</strong><br>
    Open your terminal in the project's root folder (where <code>package.json</code> is) and run:
    <pre><code>npm install</code></pre>
    This will install <code>express</code>, <code>dotenv</code>, and <code>node-fetch</code>.
  </li>

  <li>
    <strong>Add API Key</strong><br>
    <ul>
      <li>Open the <code>.env</code> file.</li>
      <li>Get your Google Gemini API key.</li>
      <li>Paste your key into the file:
        <pre><code>GEMINI_API_KEY="YOUR_API_KEY_HERE"</code></pre>
      </li>
    </ul>
  </li>
</ol>

<hr>

<h2>🚀 How to Run the Project</h2>

<ol>
  <li>
    <strong>Start the Server:</strong><br>
    In your terminal (in the project's root folder), run:
    <pre><code>npm start</code></pre>
    (This is a shortcut for <code>node server.js</code>).
  </li>

  <li>
    <strong>View Your Website:</strong><br>
    Open your browser and go to:<br>
    <a href="http://localhost:3000" target="_blank">http://localhost:3000</a><br><br>
    You should see the complete, responsive <strong>"EZ Labs"</strong> website with the new cinematic dark theme.<br>
    The contact form and both AI features will be fully functional. 🎬
  </li>
</ol>

<hr>

<p align="center">
  Made with ❤️ by <strong>Sarthak Sharma</strong><br>
  <em>DevOps & Cloud Enthusiast | Full Stack Developer</em>
</p>

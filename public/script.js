/* Filename: public/script.js */

/*
  This script handles all frontend interactivity for the "EZ Labs" site:
  1. Mobile Navigation (Hamburger Menu)
  2. Theme Toggle (Light/Dark Mode)
  3. Contact Form Submission (with validation)
  4. AI Idea Generator (calling the Gemini API)
  5. AI Message Suggester (calling the Gemini API)
*/

// Wait for the DOM to be fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Navigation ---
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav-link');

  // Show menu when toggle button is clicked
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
    });
  }

  // Hide menu when close button is clicked
  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }

  // Hide menu when a nav link is clicked (for single-page navigation)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
      }
    });
  });

  // --- 2. Theme Toggle ---
  const themeToggleButton = document.getElementById('theme-toggle-button');
  const darkThemeClass = 'dark-theme';

  // Check for saved theme in localStorage
  const savedTheme = localStorage.getItem('theme');
  
  // Apply the saved theme on page load
  if (savedTheme === 'dark') {
    document.body.classList.add(darkThemeClass);
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      // Toggle the class on the body
      document.body.classList.toggle(darkThemeClass);
      
      // Save the user's preference
      if (document.body.classList.contains(darkThemeClass)) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // --- Helper Function for API Calls ---
  /**
   * Fetches data from a server endpoint.
   * @param {string} url - The API endpoint URL.
   * @param {object} options - The options for the fetch request (method, headers, body).
   * @returns {Promise<object>} - The JSON response from the server.
   */
  async function fetchApi(url, options) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        // Use the error message from the server's JSON response if it exists
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return data;

    } catch (error) {
      console.error('API Fetch Error:', error);
      // Re-throw the error to be caught by the calling function
      throw error; 
    }
  }

  // --- Helper Function for UI State (Loading) ---
  /**
   * Toggles the loading state of a button.
   * @param {HTMLElement} button - The button element.
   * @param {boolean} isLoading - Whether to show the loader or not.
   */
  function setButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (isLoading) {
      button.disabled = true;
      btnText.classList.add('hidden');
      btnLoader.classList.remove('loader-hidden');
    } else {
      button.disabled = false;
      btnText.classList.remove('hidden');
      btnLoader.classList.add('loader-hidden');
    }
  }
  
  // --- Helper Function for Form Messages ---
  /**
   * Displays a success or error message.
   * @param {HTMLElement} messageElement - The element to display the message in.
   * @param {string} message - The message text.
   * @param {string} type - 'success' or 'error'.
   */
  function showFormMessage(messageElement, message, type) {
    messageElement.textContent = message;
    messageElement.className = 'form-message'; // Reset classes
    messageElement.classList.add(type === 'success' ? 'success-message' : 'error-message');
    messageElement.classList.remove('hidden');
  }

  // --- Helper Function for Form Errors ---
  /**
   * Displays an inline validation error.
   * @param {string} fieldId - The ID of the error element (e.g., 'error-name').
   * @param {string} message - The error message.
   */
  function showValidationError(fieldId, message) {
    const errorEl = document.getElementById(fieldId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }
  
  /** Clears all inline validation errors. */
  function clearValidationErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }


  // --- 3. Contact Form Submission ---
  const contactForm = document.getElementById('contact-form');
  const submitButton = document.getElementById('submit-button');
  const formMessageEl = document.getElementById('form-submission-message');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Stop the form from submitting normally
      
      // Clear previous errors
      clearValidationErrors();
      formMessageEl.classList.add('hidden');
      let isValid = true;

      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const phone = formData.get('phone').trim();
      const project = document.getElementById('ai-project-message').value.trim(); // Get project description
      const message = formData.get('message').trim();

      // --- Frontend Validation ---
      if (!name) {
        showValidationError('error-name', 'Name is required.');
        isValid = false;
      }
      if (!message) {
        showValidationError('error-message', 'Message is required.');
        isValid = false;
      }
      if (!email) {
        showValidationError('error-email', 'Email is required.');
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        showValidationError('error-email', 'Please enter a valid email address.');
        isValid = false;
      }
      // Optional: Simple phone validation (if it's not empty)
      if (phone && !/^[0-9\s+-]{7,15}$/.test(phone)) {
        showValidationError('error-phone', 'Please enter a valid phone number.');
        isValid = false;
      }

      if (!isValid) {
        return; // Stop if validation fails
      }
      
      setButtonLoading(submitButton, true);

      // Combine project and message
      const fullMessage = project 
        ? `Project: ${project}\n\nMessage: ${message}` 
        : message;

      try {
        // Send data to our own server's API endpoint
        await fetchApi('/api/contact-us', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, message: fullMessage }),
        });

        // Success
        showFormMessage(formMessageEl, 'Form Submitted! We will get back to you soon.', 'success');
        contactForm.reset(); // Clear the form

      } catch (error) {
        // Show error message from our server
        showFormMessage(formMessageEl, error.message, 'error');
      } finally {
        setButtonLoading(submitButton, false);
      }
    });
  }

  // --- 4. AI Idea Generator ---
  const aiGenerateButton = document.getElementById('ai-generate-button');
  const aiErrorEl = document.getElementById('ai-idea-error');
  const aiResultsContainer = document.getElementById('ai-idea-results-container');
  const aiResultsEl = document.getElementById('ai-idea-results');

  if (aiGenerateButton) {
    aiGenerateButton.addEventListener('click', async () => {
      const selectedService = document.getElementById('ai-service-select').value;
      const projectIdea = document.getElementById('ai-project-idea').value.trim();
      
      // Validation
      if (!projectIdea) {
        aiErrorEl.textContent = 'Please enter a project idea to get started.';
        aiErrorEl.classList.remove('hidden');
        return;
      }
      
      // Clear previous state
      aiErrorEl.classList.add('hidden');
      aiResultsContainer.classList.add('hidden');
      setButtonLoading(aiGenerateButton, true);
      
      // Create the prompt
      const prompt = `
        You are an expert creative director at a world-class agency called EZ Labs.
        A potential client is interested in our "${selectedService}" service.
        Their project idea is: "${projectIdea}".

        Please generate 3-5 creative, actionable, and exciting ideas for them.
        Make the ideas concrete and specific. Format the response as a bulleted list.
      `;
      
      try {
        // Call our server's Gemini endpoint
        const data = await fetchApi('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt }),
        });

        // Success
        aiResultsEl.textContent = data.text;
        aiResultsContainer.classList.remove('hidden');

      } catch (error) {
        aiErrorEl.textContent = error.message;
        aiErrorEl.classList.remove('hidden');
      } finally {
        setButtonLoading(aiGenerateButton, false);
      }
    });
  }

  // --- 5. AI Message Suggester (in Contact Form) ---
  const aiSuggestButton = document.getElementById('ai-suggest-message-button');
  const aiSuggestErrorEl = document.getElementById('error-ai-suggest');
  
  if (aiSuggestButton) {
    aiSuggestButton.addEventListener('click', async () => {
      const name = document.getElementById('name').value.trim();
      const project = document.getElementById('ai-project-message').value.trim();
      const messageTextarea = document.getElementById('message');
      
      // Validation
      if (!name || !project) {
        aiSuggestErrorEl.textContent = 'Please fill in your Name and Project Description first.';
        aiSuggestErrorEl.style.display = 'block';
        return;
      }
      
      // Clear previous state
      aiSuggestErrorEl.style.display = 'none';
      setButtonLoading(aiSuggestButton, true);

      // Create the prompt
      const prompt = `
        You are a friendly and professional assistant. A user named "${name}" 
        wants to contact EZ Labs about a project.
        Their project description is: "${project}".

        Draft a concise, friendly, and professional message for them to send.
        The message should be from the user's perspective, introducing themselves
        and their project, and asking to discuss it further.
        Do not include a greeting (like "Hi EZ Labs,") or a signature (like "Sincerely, ${name}"), 
        just write the main body of the message.
      `;
      
      try {
        // Call our server's Gemini endpoint
        const data = await fetchApi('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt }),
        });

        // Success
        messageTextarea.value = data.text.trim(); // Put the text in the textarea
        messageTextarea.focus(); // Focus the textarea so the user can edit

      } catch (error) {
        aiSuggestErrorEl.textContent = error.message;
        aiSuggestErrorEl.style.display = 'block';
      } finally {
        setButtonLoading(aiSuggestButton, false);
      }
    });
  }

});
const messageForm = document.getElementById('message-form');
const chatArea = document.getElementById('chat-area');
const loadingDiv = document.getElementById('loading-spinner');

// Add event listener to handle form submission
messageForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent page reload

  const userMessage = document.getElementById('user-message').value;

  // Add the user message to the chat area
  chatArea.innerHTML += `<div class="message user-message">${userMessage}</div>`;

  // Clear the input field
  document.getElementById('user-message').value = '';

  // Show loading spinner
  loadingDiv.style.display = 'block';

  try {
    // Send the message to the serverless function
    const response = await fetch('/.netlify/functions/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });

    // Parse the response
    const result = await response.json();

    // Hide the spinner
    loadingDiv.style.display = 'none';

    if (result.reply) {
      // Add the assistant's reply to the chat area
      chatArea.innerHTML += `<div class="message assistant-message">${result.reply}</div>`;
    } else {
      chatArea.innerHTML += `<div class="message error-message">Error: Unable to get a response from the assistant.</div>`;
    }
  } catch (error) {
    // Hide the spinner and show an error message
    loadingDiv.style.display = 'none';
    chatArea.innerHTML += `<div class="message error-message">Failed to connect to the server.</div>`;
    console.error(error);
  }
});

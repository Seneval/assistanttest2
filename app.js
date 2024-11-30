// Select the form, messages container, and loading spinner
const form = document.getElementById('chat-form');
const messagesDiv = document.getElementById('messages');
const loadingDiv = document.getElementById('loading-spinner');

// Add event listener for form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form reload

  // Get user message and clear input field
  const userMessage = document.getElementById('user-message').value;
  document.getElementById('user-message').value = '';

  // Display user's message
  const userDiv = document.createElement('div');
  userDiv.className = 'message user-message';
  userDiv.textContent = userMessage;
  messagesDiv.appendChild(userDiv);

  // Show loading spinner
  loadingDiv.style.display = 'block';

  try {
    // Send user message to backend
    const response = await fetch('/.netlify/functions/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });

    const result = await response.json();

    // Hide loading spinner
    loadingDiv.style.display = 'none';

    // Display assistant's response
    const assistantDiv = document.createElement('div');
    assistantDiv.className = 'message assistant-message';

    if (result.reply) {
      assistantDiv.textContent = result.reply;
    } else {
      assistantDiv.textContent = result.error || 'Error: Unable to get a response.';
    }
    messagesDiv.appendChild(assistantDiv);
  } catch (error) {
    // Hide loading spinner and display error
    loadingDiv.style.display = 'none';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message assistant-message';
    errorDiv.textContent = 'Error: Failed to fetch response.';
    messagesDiv.appendChild(errorDiv);
    console.error(error);
  }
});

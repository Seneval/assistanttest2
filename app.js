// Select elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Append a message to the chat box
function appendMessage(content, type) {
  const message = document.createElement('p');
  message.className = type === 'user' ? 'user-message' : 'assistant-message';
  message.textContent = content;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

// Send a message to the server
async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Append user's message
  appendMessage(userMessage, 'user');
  userInput.value = ''; // Clear input

  // Show a loading indicator
  appendMessage('Typing...', 'assistant');

  try {
    const response = await fetch('/.netlify/functions/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) throw new Error('Failed to fetch response');

    const { reply } = await response.json();

    // Replace "Typing..." with the assistant's response
    chatBox.lastChild.textContent = reply;
  } catch (error) {
    chatBox.lastChild.textContent = 'Error: Unable to get a response.';
    console.error(error);
  }
}

// Event listener
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Select DOM elements
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// Helper function to append messages
function appendMessage(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = `${sender}: ${message}`;
  messageDiv.className = sender.toLowerCase();
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the latest message
}

// Event listener for the send button
sendButton.addEventListener("click", async () => {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage("You", userMessage);
  userInput.value = ""; // Clear input

  try {
    const response = await fetch("/.netlify/functions/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from server.");
    }

    const data = await response.json();
    appendMessage("Assistant", data.reply);
  } catch (error) {
    appendMessage("Assistant", "Error: Could not process your request.");
    console.error(error);
  }
});

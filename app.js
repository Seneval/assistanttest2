const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", async () => {
  const userMessage = userInput.value;
  if (!userMessage.trim()) return;

  appendMessage("You", userMessage);
  userInput.value = "";

  appendMessage("Bot", "Thinking...");
  const botResponse = await sendMessageToAssistant(userMessage);
  chatBox.lastElementChild.textContent = `Bot: ${botResponse}`;
});

function appendMessage(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.textContent = `${sender}: ${message}`;
  chatBox.appendChild(messageElement);
}

async function sendMessageToAssistant(message) {
  try {
    const response = await fetch("/.netlify/functions/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.reply || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Error:", error);
    return "Error communicating with the assistant.";
  }
}

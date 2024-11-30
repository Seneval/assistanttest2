const fetch = require('node-fetch'); // Ensure node-fetch@2 is installed.

// Export the handler for the Netlify serverless function
exports.handler = async (event) => {
  try {
    // Parse the incoming request body to get the user's message
    const { message } = JSON.parse(event.body);

    // Define the Assistant ID explicitly
    const ASSISTANT_ID = "asst_QuRLJBdbCY7lq3Otfwrr4O7u"; // Use your OpenAI Assistant ID here

    // Make a POST request to the OpenAI Assistant API
    const response = await fetch(`https://api.openai.com/v1/assistants/${ASSISTANT_ID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // The API key is pulled from environment variables
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }], // Send the user’s input message to the assistant
      }),
    });

    // Check if OpenAI API responded successfully
    if (!response.ok) {
      const errorData = await response.json(); // Parse the error response
      throw new Error(`OpenAI API Error: ${errorData.error.message}`); // Provide detailed error information
    }

    // Parse the response from OpenAI API
    const data = await response.json();
    const reply = data.choices[0].message.content; // Extract the reply content

    // Return the response to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ reply }), // Send the assistant's reply back to the frontend
    };
  } catch (error) {
    console.error('Error:', error.message); // Log the error for debugging purposes
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch response from assistant.' }), // Return a user-friendly error message
    };
  }
};

const fetch = require('node-fetch'); // Ensure node-fetch@2
require('dotenv').config(); // Load environment variables

const ASSISTANT_ID = 'asst_QuRLJBdbCY7lq3Otfwrr4O7u'; // Replace with your assistant ID
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required.' }),
      };
    }

    // Call the Assistant API
    const response = await fetch(`https://api.openai.com/v1/assistants/${ASSISTANT_ID}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        input: message, // User's input
        max_tokens: 800, // Customize token limit
        temperature: 0.7, // Creativity
        top_p: 1.0, // Probability
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to get a response from the assistant.' }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.input || data.choices[0].message.content }),
    };
  } catch (error) {
    console.error('Server Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error. Please try again later.' }),
    };
  }
};

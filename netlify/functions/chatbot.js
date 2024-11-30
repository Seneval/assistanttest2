const fetch = require('node-fetch'); // For API calls
require('dotenv').config(); // Load environment variables

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required.' }),
      };
    }

    // OpenAI API call to the specific assistant
    const response = await fetch('https://api.openai.com/v1/assistants/asst_bQLKmNbKawCB5ig1y0HmTrQP/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // API key from environment variables
        'OpenAI-Beta': 'assistants=v2', // Beta header for Assistants API
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
        max_tokens: 100, // Adjust this as needed
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error in OpenAI API:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to get a response from the assistant.' }),
      };
    }

    const data = await response.json();
    const assistantReply = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: assistantReply }),
    };
  } catch (error) {
    console.error('Server Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error.' }),
    };
  }
};

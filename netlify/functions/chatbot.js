require('dotenv').config();
const fetch = require('node-fetch');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    const response = await fetch('https://api.openai.com/v1/assistants/asst_QuRLJBdbCY7lq3Otfwrr4O7u/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        input: { content: message },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error in OpenAI API');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content }),
    };
  } catch (error) {
    console.error('Error:', error.message || error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' }),
    };
  }
};

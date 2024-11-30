const fetch = require('node-fetch'); // Ensure version 2 is installed

exports.handler = async (event) => {
    try {
        // Parse the incoming request
        const body = JSON.parse(event.body);
        const userMessage = body.message; // User's input message

        // Environment Variables
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Your OpenAI API Key
        const ASSISTANT_ID = 'asst_QuRLJBdbCY7lq3Otfwrr4O7u'; // Your Assistant ID

        // Assistant API Endpoint
        const url = `https://api.openai.com/v1/assistants/${ASSISTANT_ID}/chat/completions`;

        // Construct the payload
        const payload = {
            messages: [
                { role: "user", content: userMessage } // User's input
            ]
        };

        // Make the API call
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "OpenAI-Beta": "assistants=v2" // Beta header for Assistants API
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json(); // Parse the response

        // Handle API errors
        if (!response.ok) {
            console.error("OpenAI API Error:", data);
            throw new Error(data.error?.message || "Failed to get response from OpenAI API");
        }

        // Extract assistant's reply
        const assistantReply = data.choices[0].message.content;

        // Return the response
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: assistantReply }),
        };
    } catch (error) {
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Unable to process your request." }),
        };
    }
};

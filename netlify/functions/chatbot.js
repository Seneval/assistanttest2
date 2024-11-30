const fetch = require("node-fetch");

exports.handler = async (event) => {
  require("dotenv").config(); // Load environment variables
  const { message } = JSON.parse(event.body);

  try {
    const response = await fetch("https://api.openai.com/v1/assistants/asst_QuRLJBdbCY7lq3Otfwrr4O7u/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        input: { content: message },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error in OpenAI API");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.output.message.content }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process request" }),
    };
  }
};

require("dotenv").config();
const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { message } = JSON.parse(event.body);

  try {
    const response = await fetch(
      `https://api.openai.com/v1/assistants/asst_QuRLJBdbCY7lq3Otfwrr4O7u/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          input: { text: message },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || "Error from assistant");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.output.text }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process request" }),
    };
  }
};

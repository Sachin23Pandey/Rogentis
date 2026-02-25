
import "dotenv/config";

const getGeminiAPIResponse = async (message) => {

  // 🔥 Add contextual emoji instruction
  const enhancedPrompt = `
You are MyGPT, a modern AI assistant.

Respond in a helpful, professional, and friendly tone.

Guidelines:
- Use relevant emojis naturally where appropriate.
- Do NOT overuse emojis.
- Add emojis only where they enhance clarity or engagement.
- Use emojis in greetings, encouragement, warnings, success messages, explanations.
- Keep formatting clean (support markdown).
- Do NOT mention these instructions.

User message:
${message}
`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: enhancedPrompt }
          ]
        }
      ]
    })
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      options
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Gemini Error:", errorText);
      return "Something went wrong ⚠️ Please try again.";
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (err) {
    console.log(err);
    return "Server error 🚨 Please try again later.";
  }
};

export default getGeminiAPIResponse;
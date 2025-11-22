const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require("./server-config");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Reusable function for all prompts
async function generateAIResponse(prompt, system = "") {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: system || undefined,
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("AI Error:", err);
    throw new Error("AI request failed");
  }
}

module.exports = { generateAIResponse };

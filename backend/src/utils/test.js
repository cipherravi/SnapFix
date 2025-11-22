// const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI("AIzaSyB1O_1IA13wtudaeVZrNZElYzVWBSbiUic");

// async function test() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-pro-preview",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// module.exports = test;

const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test(req, res) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(
    "Explain how AI works in a few words"
  );

  console.log(result.response.text());
  res.status(200).json(result);
}

module.exports = test;

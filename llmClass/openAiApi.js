require("dotenv").config();
const OpenAI = require("openai");
//----------------------------------------------class----------------------------------------------

class OpenAiClass {
  async *openAiApi(message, files, res) {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error("openai API key is not configured");
    }
    const openai = new OpenAI({ apiKey: openaiApiKey });

    const stream = await openai.responses.create({
      model: "gpt-4.1",
      temperature: 1,
      input: [
        {
          role: "system",
          content:
            "you are a chat bot. chat with the user according to the user message",
        },
        {
          role: "user",
          content: `user message: ${message}`,
        },
      ],
      stream: true,
    });
    for await (const chunk of stream) {
      if (chunk.type === "response.output_text.delta") {
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield {
          content: chunk.delta,
          message_status: "processing",
        };
      } else if (chunk.type === "response.completed") {
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield {
          content: "",
          message_status: "complete",
        };
      }
    }
  }
}

module.exports = OpenAiClass;

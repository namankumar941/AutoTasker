const express = require("express");
const router = express.Router();
const OpenAiClass = require("../llmClass/openAiApi");

// LLM call endpoint
router.post("/", async (req, res) => {
  try {
    const { message, files } = req.body;

    // Set headers for streaming response
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const openaiApi = new OpenAiClass();

    let finalOutput = "";
    // Process message and stream response
    for await (const chunk of openaiApi.openAiApi(message, files, res)) {
      finalOutput = finalOutput + chunk.content;
      // Send each chunk as a new line JSON string
      res.write(JSON.stringify(chunk) + "\n");

      // If this is the final chunk (complete status), end the response
      if (chunk.message_status === "complete") {
        res.end();
      }
    }
    console.log("123", finalOutput);
  } catch (error) {
    console.error("Error in LLM processing:", error);
    // If we haven't started sending response chunks yet, send error
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to process message" });
    } else {
      // If we've already started streaming, send error as a chunk
      res.write(
        JSON.stringify({
          content: "\nAn error occurred while processing the message.",
          message_status: "complete",
        })
      );
      res.end();
    }
  }
});

module.exports = router;

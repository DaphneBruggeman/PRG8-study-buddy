require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { ChatOpenAI } = require("@langchain/openai");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

function createPrompt(history) {
    const prompt = history.map(entry => `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.content}`).join('\n');
    return prompt;
}

// Endpoint for chat query
app.post("/chat", async (req, res) => {
  const { query, history } = req.body;
  console.log("Received query:", query);

  try {
    const model = new ChatOpenAI({
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
      azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
      azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    });

    const prompt = createPrompt(history);
    const response = await model.invoke(prompt);
    console.log("Response from OpenAI:", response.content);
    res.json({ response: response.content });
  } catch (error) {
    console.error("Error invoking ChatGPT:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
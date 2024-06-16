require("dotenv").config();

const express = require("express");
const cors = require("cors");
// conectie 
const { ChatOpenAI } = require("@langchain/openai");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

function createPrompt(history) {
    const prompt = history.map(entry => `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.content}`).join('\n');
    return prompt;
}

// einde voor chat query
app.post("/chat", async (req, res) => {
  const { query, history } = req.body;
  console.log("Received query:", query);

// Key's bekijken 
  try {
    const model = new ChatOpenAI({
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
      azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
      azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    });

//Dit wordt gebruikt om een prompt te maken voor openAI op basis van de voorgestelde vragen van de gebruiker
    const prompt = createPrompt(history);

// Aanroepen van de api van open AI
    const response = await model.invoke(prompt);
    console.log("Response from OpenAI:", response.content);

// Antwoord van openAI wordt terug gestuurd naar de client in json. 
    res.json({ response: response.content });
  } catch (error) {
    console.error("Error invoking ChatGPT:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start de server
app.listen(port, () => {
  console.log(`Server is running`);
});
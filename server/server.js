require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");

const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RetrievalQAChain } = require("langchain/chains");

// Express setup
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Load PDF and create vectorstore
let vectorStore;

async function initializeVectorStore() {
  const loader = new PDFLoader("./1049-ikea-cao-1-10-2023-tm-31-12-2024-v07022024.pdf");
  const rawDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 150 });
  const docs = await splitter.splitDocuments(rawDocs);

  const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: `deploy-text-embedding-ada`,
  });

  vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  console.log("VectorStore initialized from PDF.");
}

initializeVectorStore();

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { query } = req.body;
  console.log("Received query:", query);

  try {
    const model = new ChatOpenAI({
      temperature: 0,
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
      azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
      azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
      returnSourceDocuments: true,
    });

    const result = await chain.call({ query });

    res.json({ response: result.text });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Server start
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

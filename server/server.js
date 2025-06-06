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
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const model = new ChatOpenAI({
      temperature: 0,
      streaming: true,
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
      azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
      azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    });

    const retriever = vectorStore.asRetriever();
    const contextDocs = await retriever.getRelevantDocuments(query);
    const context = contextDocs.map(doc => doc.pageContent).join("\n\n");

    const messages = [
      {
        role: "system",
        content:
          "Je bent een AI-assistent die alleen vragen beantwoordt op basis van de IKEA-cao. Als het antwoord niet in het document staat, zeg dan dat je het niet weet.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nVraag:\n${query}`,
      },
    ];

    const stream = await model.stream(messages);

    for await (const chunk of stream) {
      const token = chunk.content;
      if (token) {
        res.write(token);
      }
    }

    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    res.write("Fout tijdens streaming.");
    res.end();
  }
});


// Server start
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

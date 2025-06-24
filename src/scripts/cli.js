import readline from "readline";
import process from "process";
import { ChromaClient } from "chromadb";
import { askRAG } from "../services/rag.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "🤖 Ask something: "
});

const client = new ChromaClient({ host: "localhost", port: 8000 });
const collection = await client.getCollection({ name: "art_collection" });

console.log("💬 Welcome to Museum Chat CLI (RAG-powered)\nType your question or 'exit' to quit.");
rl.prompt();

rl.on("line", async (line) => {
  const question = line.trim();
  if (!question) return rl.prompt();
  if (question.toLowerCase() === "exit") return rl.close();

  try {
    console.log("⏳ Thinking...");
    const { answer, sources } = await askRAG(question, collection);

    console.log(`\n✅ Answer:\n${answer}\n`);

    if (sources.length > 0) {
      console.log("📄 Based on documents:");
      sources.forEach(({ id, snippet }, idx) => {
        console.log(`\n🗂️ ${idx + 1}. ID: ${id}`);
        console.log(`🔍 Snippet:\n${snippet}`);
      });
    } else {
      console.log("⚠️ No relevant context found.");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  rl.prompt();
}).on("close", () => {
  console.log("👋 Goodbye!");
  process.exit(0);
});

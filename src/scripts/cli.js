import readline from "readline";
import process from "process";
import { askRAG } from "../services/rag.js";
import { log } from "../utils/logger.js";
import { collection } from "../vector-store.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "🤖 Ask something: "
});


log("----------start----------", true);
log("💬 Welcome to Museum Chat CLI (RAG-powered)\nType your question or 'exit' to quit.");
rl.prompt();
log("🤖 Ask something: ", true);

rl.on("line", async (line) => {
  const question = line.trim();
  if (!question) return rl.prompt();
  log(question, true)
  if (question.toLowerCase() === "exit") return rl.close();

  try {
    log("⏳ Thinking...");
    const { answer, sources } = await askRAG(question, collection);

    log(`\n✅ Answer:\n${answer}\n`);

    if (sources.length > 0) {
      log("📄 Based on documents:");
      sources.forEach(({ id, snippet }, idx) => {
        log(`\n🗂️ ${idx + 1}. ID: ${id}`);
        log(`🔍 Snippet:\n${snippet}`);
      });
    } else {
      log("⚠️ No relevant context found.");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  rl.prompt();
  log("🤖 Ask something: ", true);
}).on("close", () => {
  log("👋 Goodbye!");
  log("----------end----------", true);
  process.exit(0);
});

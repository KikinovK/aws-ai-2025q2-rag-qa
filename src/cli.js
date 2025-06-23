import readline from "readline";
import { askLLM } from "./llm.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "🤖 Ask something: "
});

console.log("💬 Welcome to Museum Chat CLI (powered by LLM)\nType your question or 'exit' to quit.");
rl.prompt();

rl.on("line", async (line) => {
  const question = line.trim();

  if (!question) {
    rl.prompt();
    return;
  }

  if (question.toLowerCase() === "exit") {
    rl.close();
    return;
  }

  try {
    console.log("⏳ Thinking...");
    const answer = await askLLM(question);
    console.log("\n✅ Answer:\n" + answer + "\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  rl.prompt();
}).on("close", () => {
  console.log("👋 Goodbye!");
  process.exit(0);
});

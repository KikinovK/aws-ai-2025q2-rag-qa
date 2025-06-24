
import { embed } from "./generate-embeddings.js";
import { searchByEmbedding } from "./search.js";
import { createPrompt } from "./prompt.js";
import { askLLM } from "./llm.js";

/**
 * Full RAG pipeline: question → embedding → retrieval → prompt → LLM → answer
 */
export async function askRAG(question, collection, topK = 5) {
  try {
    console.log("📥 Question:", question);

    const queryEmbedding = await embed(question);
    console.log("🔎 Created embedding");

    const results = await searchByEmbedding(queryEmbedding, collection, topK);
    console.log(`📚 Retrieved top ${topK} documents:`, results.ids?.[0]);

    const contextChunks = results.metadatas?.[0]?.map((m) => m.text) || [];

    const prompt = createPrompt(contextChunks, question);
    console.log("🧾 Prompt created:\n", prompt.slice(0, 300), "...");

    const answer = await askLLM(prompt);
    console.log("🤖 LLM responded");

    return {
      answer,
      sources: results.ids?.[0].map((id, i) => ({
        id,
        snippet: contextChunks[i]?.slice(0, 200)
      }))
    };
  } catch (error) {
    console.error("❌ RAG pipeline failed:", error.message);
    throw error;
  }
}

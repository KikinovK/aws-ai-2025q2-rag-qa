
import { embed } from "./generate-embeddings.js";
import { searchByEmbedding } from "./search.js";
import { createPrompt } from "./prompt.js";
import { askLLM } from "./llm.js";

/**
 * Full RAG pipeline: question → embedding → retrieval → prompt → LLM → answer
 */
export async function askRAG(question, collection, topK = 5) {
  try {
    const queryEmbedding = await embed(question);
    const results = await searchByEmbedding(queryEmbedding, collection, topK);

    const contextChunks = results.metadatas?.[0]?.map((m) => m.text) || [];

    const prompt = createPrompt(contextChunks, question);

    const answer = await askLLM(prompt);

    return {
      answer,
      context: contextChunks,
      ids: results.ids?.[0] || []
    };
  } catch (error) {
    console.error("❌ RAG pipeline failed:", error.message);
    throw error;
  }
}

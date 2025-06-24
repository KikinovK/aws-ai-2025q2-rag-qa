import { embed } from "./generate-embeddings.js";

export async function searchByEmbedding(queryEmbedding, collection, n = 5) {
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: n,
    include: ["metadatas", "distances"]
  });

  console.log("🔎 Found relevant documents:");
  results.ids[0].forEach((id, idx) => {
    console.log(`• ${id}`);
    console.log(`  Distance: ${results.distances[0][idx]}`);
    console.log(`  Snippet: ${results.metadatas[0][idx].text.slice(0, 200)}...`);
  });

  return results;
}

export async function searchByText(queryText, collection,  n = 5) {
  const queryEmbedding = await embed(queryText);
  return searchByEmbedding(queryEmbedding, collection, n);
}

import { embed } from "./generate-embeddings.js";

export async function searchByEmbedding(queryEmbedding, collection, n = 5) {
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: n,
    include: ["metadatas", "distances"]
  });

  return results;
}

export async function searchByText(queryText, collection,  n = 5) {
  const queryEmbedding = await embed(queryText);
  return searchByEmbedding(queryEmbedding, collection, n);
}

import { ChromaClient } from "chromadb";
import fs from "fs";
import { searchByEmbedding } from "./search.js";
import { log } from "../utils/logger.js";

export async function chromaInit() {
  const collectionName = "art_collection";
  const BATCH_SIZE = 5000;

  const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false,
  });

  const existingCollections = await client.listCollections();
  const exists = existingCollections.some(c => c.name === collectionName);

  if (exists) {
    log(`ℹ️ Collection "${collectionName}" already exists. Deleting...`);
    await client.deleteCollection({ name: collectionName });
    log(`✅ Deleted.`);
  }

  const collection = await client.createCollection({
    name: collectionName,
    embeddingFunction: null, // required if you provide precomputed embeddings
  });

  log(`✅ Collection "${collectionName}" created.`);

  // Загрузка эмбеддингов
  const embeddings = JSON.parse(fs.readFileSync("embeddings/embeddings.json", "utf8"));

  const ids = embeddings.map(e => e.id);
  const vectors = embeddings.map(e => e.embedding);
  const metadatas = embeddings.map(e => ({ text: e.text }));

  // Добавляем в батчах
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = {
      ids: ids.slice(i, i + BATCH_SIZE),
      embeddings: vectors.slice(i, i + BATCH_SIZE),
      metadatas: metadatas.slice(i, i + BATCH_SIZE),
    };

    await collection.add(batch);
    log(`✅ Added batch ${Math.floor(i / BATCH_SIZE) + 1}`);
  }

  log("✅ All embeddings added to ChromaDB");

  // Тестовый поиск
  const queryEmbedding = vectors[0];
  const results = await searchByEmbedding(queryEmbedding, collection, 5);

  log("🔍 Sample search results:");
  results.ids[0].forEach((id, i) => {
    log(`• ${id} — Distance: ${results.distances[0][i].toFixed(4)}`);
  });
}

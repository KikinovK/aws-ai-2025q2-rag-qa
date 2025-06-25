import { ChromaClient } from "chromadb";
import fs from "fs";

import { searchByEmbedding } from "./search.js";
import { log } from "../utils/logger.js";

export async function chromaInit() {

  const collectionName = "art_collection";

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
    embeddingFunction: null,
 });
  log(`✅ Collection "${collectionName}" created.`);


  const embeddings = JSON.parse(fs.readFileSync("embeddings/embeddings.json", "utf8"));

  const ids = embeddings.map(e => e.id);
  const vectors = embeddings.map(e => e.embedding);
  const metadatas = embeddings.map(e => ({ text: e.text }));


  await collection.add({
    ids,
    embeddings: vectors,
    metadatas,
  });

  log("✅ Embeddings added to ChromaDB");


  const queryEmbedding = vectors[0];

  const results = await searchByEmbedding(queryEmbedding, collection, 5);

  log("Search results:", results);
}

import { ChromaClient } from "chromadb";

const client = new ChromaClient({ host: "localhost", port: 8000 });
export const collection = await client.getCollection({ name: "art_collection" });

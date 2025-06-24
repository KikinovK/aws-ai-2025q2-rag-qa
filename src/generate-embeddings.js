import fs from "fs";
import path from "path";
import { encode } from "gpt-3-encoder";
import dotenv from "dotenv";
import * as inference from "@huggingface/inference";

dotenv.config();

const hf = new inference.HfInference(process.env.HF_TOKEN);
const MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const MAX_TOKENS = 800;


function getJsonFilesRecursive(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getJsonFilesRecursive(fullPath));
    } else if (file.isFile() && file.name.endsWith(".json")) {
      results.push(fullPath);
    }
  }
  return results;
}

function loadChunksFromDocuments(dataDir = "./data") {
  const files = getJsonFilesRecursive(dataDir);
  const chunks = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    try {
      const json = JSON.parse(raw);
      const text = buildText(json);
      const tokenIds = encode(text);

      for (let i = 0; i < tokenIds.length; i += MAX_TOKENS - 100) {
        const chunkTokens = tokenIds.slice(i, i + MAX_TOKENS);
        const chunkText = chunkTokens.map(id => id).join(" ");
        chunks.push({
          id: `${path.relative(dataDir, file)}#${i}`,
          original: text,
          chunk: chunkText
        });

        if (i + MAX_TOKENS >= tokenIds.length) break;
      }
    } catch (e) {
      console.warn(`Skipping ${file} due to parse error`);
    }
  }

  return chunks;
}

function buildText(json) {
  return [
    `Title: ${json.title}`,
    json.artist && `Artist: ${json.artist}`,
    json.country && `Country: ${json.country}`,
    json.dated && `Date: ${json.dated}`,
    json.medium && `Material: ${json.medium}`,
    json.department && `Department: ${json.department}`,
    json.description && `Description: ${json.description}`,
    json.text && `Details: ${json.text}`,
  ].filter(Boolean).join("\n");
}

async function embed(text) {
  const result = await hf.featureExtraction({
    model: MODEL,
    inputs: text
  });
  return result;
}

(async () => {
  const chunks = loadChunksFromDocuments();
  console.log(`Embedding ${chunks.length} chunks...`);

  const out = [];

  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    try {
      const vector = await embed(c.original);
      out.push({
        id: c.id,
        text: c.original,
        embedding: vector
      });
      console.log(`✅ Embedded [${i + 1}/${chunks.length}]`);
    } catch (e) {
      console.error(`❌ Failed embedding chunk ${c.id}  error: ${e.message}`);
    }
  }

  fs.writeFileSync("embeddings/embeddings.json", JSON.stringify(out, null, 2));
  console.log("✅ Saved embeddings to embeddings.json");
})();

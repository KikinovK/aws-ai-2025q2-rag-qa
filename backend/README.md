# 🖼️ Museum Q&A Chatbot (RAG)
## Backend
Based on Node.js, ChromaDB, Hugging Face, and LLM.

## 📦 Project Structure

src/

├── data/                   # JSON files with museum objects

├── embeddings/             # File with vector embeddings

├── scripts/                # CLI and script runners

├── services/               # Search, generation, and storage logic

├── api/                    # REST API

└── utils/                  # Logging, tokenization, etc.

## ✅ Requirements
Node.js >= 20
ChromaDB (local)
Hugging Face Token with access to sentence-transformers/all-MiniLM-L6-v2
.env file

## ⚙️ Installation and Launch

```sh
cd backend
npm install
```

## 🔐 .env Configuration
Create a `.env` file in the project root:

```env
HF_TOKEN=your_huggingface_token
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_API_KEY=your_openai_api_key
```

## 🧠 Preparing the Knowledge Base
Place .json files with museum objects in `src/data/`
Example object structure:

```json
{
  "title": "Ancient Vase",
  "artist": "Unknown",
  "country": "Greece",
  "dated": "5th century BC",
  "medium": "Ceramic",
  "department": "Classical Art",
  "text": "This vase was used in rituals..."
}
```

Use the Minneapolis Institute of Art collection dataset from [https://github.com/artsmia/collection](https://github.com/artsmia/collection).

## Generating Embeddings and Uploading Vectors to ChromaDB:

```sh
node src/scripts/create-chroma-db.js
```

Make sure the local Chroma server is running:

## 💬 Running the CLI Chat

```sh
node src/scripts/cli.js
```

## 🌐 Running the REST API

```sh
node src/server.js
```

### Swagger documentation will be available at:
➡️ http://localhost:3000/api/docs

### Example request:

```
POST /api/ask
{
  "question": "Tell me about ancient Greek ceramics"
}
```

### 📜 Logging
All actions are logged to log.txt, including:

- session start and end
- requests
- found documents
- generated answers
- errors

## 📌 Used Ports
3000 — REST API
8000 — ChromaDB (default)

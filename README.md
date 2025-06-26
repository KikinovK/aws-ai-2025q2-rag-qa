# 🧠 Museum RAG Q&A System
An interactive chatbot powered by Retrieval-Augmented Generation (RAG) for answering questions about artworks from the Minneapolis Institute of Art collection. Built with Node.js, ChromaDB, Hugging Face, OpenAI, and React.

## 📌 Task Context
This project was created as part of the Hands-on Task: [RAG Question-Answering System](https://github.com/rolling-scopes-school/tasks/blob/feat/ai-practitioner-course/ai-practitioner/README.md)
Course: [AWS AI Practitioner Course 2025Q2](https://github.com/rolling-scopes-school/tasks/blob/feat/ai-practitioner-course/ai-practitioner/task1.md)

## ⚙️ Installation and Launch

```sh
git clone https://github.com/your-user/rag-museum-qa.git
cd rag-museum-qa
npm install
```

```sh
npm run dev:backend    # or: node backend/src/server.js
npm run dev:frontend   # or: cd frontend && npm run dev
```

[📦 Backend Setup & API Docs →](./backend/README.md)
Includes: data preparation, embedding generation, ChromaDB setup, API with Swagger

[💻 Frontend Setup →](./frontend/README.md)
Includes: Vite + React UI, question/answer interface, display of sources

## 📽️ Demo Video
[📺 Watch the demo on YouTube](https://youtu.be/OzdmclTtmB4)


## 📚 Data Source
Based on the public collection from the
[🎨 Minneapolis Institute of Art](https://github.com/artsmia/collection)

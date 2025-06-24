export function createPrompt(documents, question) {
  return `
You are a helpful AI assistant working in a museum.
Based only on the documents below, answer the user's question as accurately as possible.

Documents:
${documents.map((doc, i) => `Document ${i + 1}:\n${doc}`).join("\n\n")}

Question:
${question}

Answer:
`.trim();
}

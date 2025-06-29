import fetch from "node-fetch";
import dotenv from "dotenv";
import process from "process";
import { log } from "../utils/logger.js";

dotenv.config();

const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      { role: "user", content: "Tell me about Japanese ceramic art" }
    ]
  })
});

  const data = await res.json();
  log('answer', data);

  try {
    log('answer:', data.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
    log('answer', data);
  }

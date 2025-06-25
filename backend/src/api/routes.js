import express from "express";
import { z } from "zod";
import { askRAG } from "../services/rag.js";
import { collection } from "../vector-store.js";

const router = express.Router();

const QuestionSchema = z.object({
  question: z.string().min(3, "Question is too short")
});

router.post("/ask", async (req, res) => {
  const parsed = QuestionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  try {
    const { answer, sources } = await askRAG(parsed.data.question, collection);
    res.json({ answer, sources });
  } catch (error) {
    console.error("❌ API Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

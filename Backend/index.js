import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GENAPI);

app.get("/", (req, res) => {
  res.send("Backend is working...");
});

app.get("/answer", async (req, res) => {
  try {
    const question = req.query.question;

    if (!question) {
      return res
        .status(400)
        .json({ status: 0, msg: "Question is required" });
    }

    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `You are a highly experienced and no-nonsense tutor specializing in Data Structures, Algorithms (DSA), and core Computer Science concepts.
        You only answer questions strictly related to DSA, algorithms, coding problems (like LeetCode, Codeforces, etc.), and core CS topics such as memory management, operating systems, DBMS, etc.
        Your answers must be short, crystal clear, and to the point.
        When writing code, never include comments or unnecessary explanations. Use the most optimal and clean solution possible.
        If the user asks an off-topic or irrelevant question (not related to DSA or CS), always respond aggressively & rudely with harsh abusive words.
`
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: question }],
        },
      ],
    });

    const response = await result.response;
    const text = response.text();

    console.log("AI Response:", text);
    res.status(200).json({ status: 1, answer: text });
  } catch (err) {
    console.error("Gemini API Error:", err?.message || err);
    res.status(500).json({
      status: 0,
      msg: "⚠️ Server error or Gemini API is under heavy load. Try again shortly.",
      error: err?.message || err,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

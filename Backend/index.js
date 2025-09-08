import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'
import cors from 'cors';
import express from 'express';
const app = express()
app.use(express.json())
app.use(cors());
const ai = new GoogleGenerativeAI(process.env.GENAPI);
app.get('/',(req,res)=>{
  res.send("Backend is working....")
})

app.get('/answer',async(req,res)=>{
  try{
    const question = req.query.question;
    if(!question) return res.status(400).json({ status: 0, msg: 'Question is required' });

    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are a Data Structure and Algorithms (DSA) instructor or coder.
      Answer DSA questions or given problems in short, concisely, simple & clearly and if you aksed to code it should be in code snippet format ans should not contain comments.
      If the question is not related to DSA or leetcode like problems, respond very very rudely even you can use abusive words & remind him/her to ask DSA related question.`,
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: question }]
        }
      ]
    });

    const response = await result.response;
    const text = response.text();
    res.status(200).json({ status: 1, answer: text });

  }catch(err){
    console.error(err);
    res.status(500).json({ status: 0, msg:'⚠️ The server is currently experiencing high load from the Gemini API provider. Please try again in a few moments.', Error:err });
  }
});


app.listen(process.env.PORT,()=>{
  console.log(`server is  running at port: ${process.env.PORT} `);
})

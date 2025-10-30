import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateReport(insightsData) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `
You are a marketing analytics assistant.
Given this campaign data from Meta Ads, summarize performance and suggest optimizations.

Data:
${JSON.stringify(insightsData, null, 2)}
`;
  const response = await model.generateContent(prompt);
  return response.response.text();
}

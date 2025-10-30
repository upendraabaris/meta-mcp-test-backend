// import express from "express";
// import bodyParser from "body-parser";
// import { createMcpClient } from "./createMcpClient.js";

// const app = express();
// app.use(bodyParser.json());

// let mcpClient;

// (async () => {
//   try {
//     mcpClient = await createMcpClient();
//     console.log("✅ MCP client initialized successfully");
//   } catch (err) {
//     console.error("❌ Failed to initialize MCP client:", err);
//   }
// })();

// app.post("/chat", async (req, res) => {
//   try {
//     const msg = req.body.message;
//     if (!mcpClient) {
//       return res.status(500).json({ error: "MCP client not initialized" });
//     }

//     // Example call — adjust tool name and parameters as needed
//     const result = await mcpClient.callTool("get_insights", { campaign_id: "1234" });
//     res.json(result);
//   } catch (error) {
//     console.error("❌ Error in /chat route:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(4000, () => console.log("🚀 Server running on http://localhost:4000"));


// import { McpClient } from "@modelcontextprotocol/sdk";

// async function main() {
//   try {
//     const client = await McpClient.connect({
//       name: "meta-ads-client",
//       version: "1.0.0",
//       transport: {
//         type: "websocket",              // safer on Windows
//         url: "ws://localhost:4001",     // MCP server ka websocket URL
//       },
//     });

//     console.log("🔗 Connected to MCP server successfully");

//     // Example: available tools list
//     const tools = await client.listTools();
//     console.log("Available Tools:", tools);

//     // Example: call a tool
//     const result = await client.callTool("get_insights", { campaign_id: "1234" });
//     console.log("Tool Result:", result);

//   } catch (err) {
//     console.error("❌ Error connecting to MCP server:", err);
//   }
// }

// main();

// server.js
// import express from "express";
// import bodyParser from "body-parser";
// import { createMcpClient } from "./createMcpClient.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const app = express();
// app.use(bodyParser.json());

// let mcpClient;

// Initialize MCP client once on startup
// (async () => {
//   try {
//     mcpClient = await createMcpClient();
//     console.log("✅ MCP client initialized successfully");
//   } catch (err) {
//     console.error("❌ MCP client initialization failed:", err);
//   }
// })();

// Example route to call a tool
// app.post("/chat", async (req, res) => {
//   try {
//     if (!mcpClient) {
//       return res.status(500).json({ error: "MCP client not initialized" });
//     }

//     const { tool, args } = req.body;
//     console.log(`⚙️ Calling tool: ${tool} with args:`, args);

//     const result = await mcpClient.callTool({
//       name: tool,
//       arguments: args,
//     });

//     res.json(result);
//   } catch (error) {
//     console.error("❌ Error during tool call:", error);
//     res.status(500).json({ error: error.message });
//   }
// });
// import dotenv from "dotenv";
// const genAI = new GoogleGenerativeAI("AIzaSyBZPU4LsnZDMPHwsg8yGX9oIawtU3Do-dE");
// dotenv.config();
// app.post("/chat", async (req, res) => {
//   try {
//     if (!mcpClient) {
//       return res.status(500).json({ error: "MCP client not initialized" });
//     }

//     const userMessage = req.body.message;
//     if (!userMessage) {
//       return res.status(400).json({ error: "No message provided" });
//     }

//     // 🧠 Step 1: Ask Gemini to decide which MCP tool to call and with what args
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const prompt = `
// You are an assistant that formats user requests for a Model Context Protocol (MCP) server.
// The server has tools like get_insights, create_campaign, get_audience, etc.

// Given a user message, output JSON only in this format:
// {
//   "tool": "<tool_name>",
//   "args": { "<arg_name>": "<value>", ... }
// }

// User message: "${userMessage}"
// `;

//     const geminiResponse = await model.generateContent(prompt);
//     const text = geminiResponse.response.text();

//     console.log("🧠 Gemini raw response:", text);

//     // Try to parse Gemini output into a JSON object
//     let parsed;
//     try {
//       parsed = JSON.parse(text);
//     } catch {
//       throw new Error("Gemini response was not valid JSON:\n" + text);
//     }

//     const { tool, args } = parsed;
//     if (!tool || !args) {
//       throw new Error("Gemini did not provide valid tool or args");
//     }

//     console.log(`⚙️ Calling MCP tool: ${tool} with args:`, args);

//     // 🧩 Step 2: Call the MCP tool
//     const result = await mcpClient.callTool({
//       name: tool,
//       arguments: args,
//     });

//     // 🧩 Step 3: Send MCP result back to the user
//     res.json({
//       success: true,
//       tool,
//       args,
//       mcpResult: result,
//     });
//   } catch (error) {
//     console.error("❌ Error in /chat route:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post("/chat", async (req, res) => {
//   try {
//     if (!mcpClient) {
//       return res.status(500).json({ error: "MCP client not initialized" });
//     }

//     const userMessage = req.body.message;
//     if (!userMessage) {
//       return res.status(400).json({ error: "No message provided" });
//     }

//     // 🧠 Step 1: Ask Gemini to decide which MCP tool to call and with what args
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const prompt = `
// You are an assistant that formats user requests for a Model Context Protocol (MCP) server.
// Available tools: get_insights, create_campaign, get_audience, get_creative, get_analytics, etc.

// Given a user message, output *only* valid JSON in this format:
// {
//   "tool": "<tool_name>",
//   "args": { "<arg_name>": "<value>", ... }
// }

// Do not include explanations, markdown, or text outside the JSON.

// User message: "${userMessage}"
// `;

//     const geminiResponse = await model.generateContent(prompt);
//     let text = geminiResponse.response.text().trim();

//     console.log("🧠 Gemini raw response:", text);

//     // ✅ Clean Gemini output — remove code blocks or markdown formatting
//     text = text
//       .replace(/```json/i, "")
//       .replace(/```/g, "")
//       .replace(/^[^{]*({[\s\S]*})[^}]*$/m, "$1") // extract the JSON object
//       .trim();

//     // ✅ Try to parse JSON safely
//     let parsed;
//     try {
//       parsed = JSON.parse(text);
//     } catch (err) {
//       console.error("⚠️ Gemini output parse failed:", text);
//       throw new Error("Gemini response was not valid JSON.");
//     }

//     const { tool, args } = parsed;
//     if (!tool || typeof args !== "object") {
//       throw new Error("Gemini did not return valid 'tool' or 'args'.");
//     }

//     console.log(`⚙️ Calling MCP tool: ${tool} with args:`, args);

//     // 🧩 Step 2: Call the MCP tool
//     const result = await mcpClient.callTool({
//       name: tool,
//       arguments: args,
//     });

//     // 🧩 Step 3: Send MCP result back to client
//     res.json({
//       success: true,
//       tool,
//       args,
//       mcpResult: result,
//     });
//   } catch (error) {
//     console.error("❌ Error in /chat route:", error);
//     res.status(500).json({ error: error.message });
//   }
// });


// // Optional: route to list tools
// app.get("/tools", async (req, res) => {
//   try {
//     const tools = await mcpClient.listTools();
//     console.log("🧰 Available tools on MCP server:", tools);
//     res.json(tools);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(9090, () => console.log("🚀 Express API running on http://localhost:9090"));


import express from "express";
import bodyParser from "body-parser";
import { createMcpClient } from "./createMcpClient.js";
import { generateReport } from "./gemini.js";
import { genAI } from "./gemini.js";

const app = express();
app.use(bodyParser.json());

let mcpClient;
(async () => {
  mcpClient = await createMcpClient();
})();

app.get("/campaigns", async (req, res) => {
  const result = await mcpClient.callTool({ name: "list_campaigns", arguments: { account_id: "act_2359265171002937"} });
  res.json(result);
});

app.get("/insights/:campaign_id", async (req, res) => {
  const result = await mcpClient.callTool({
    name: "get_insights",
    arguments: {  object_id: req.params.campaign_id,
        level: "campaign", // can also be "adset" or "ad" },
    }
  });
  const report = await generateReport(result);
  res.json({ rawData: result, aiReport: report });
});

app.post("/update-campaign", async (req, res) => {
  const result = await mcpClient.callTool({
    name: "update_campaign",
    arguments: req.body,
  });
  res.json(result);
});

app.post("/chat", async (req, res) => {
  try {
    if (!mcpClient) {
      return res.status(500).json({ error: "MCP client not initialized" });
    }

    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    // 🧠 Step 1: Ask Gemini which MCP tool & args to call
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an intelligent assistant that decides which MCP tool to call for the user's query.
Available tools and their arguments:

1️⃣ list_campaigns
   - arguments: { "account_id": "act_<id>" }

2️⃣ get_insights
   - arguments: { "object_id": "<campaign_id>", "level": "campaign" }

3️⃣ update_campaign
   - arguments: { "campaign_id": "<id>", "status": "PAUSED" | "ACTIVE" }

Respond ONLY with valid JSON in this exact format:
{
  "tool": "<tool_name>",
  "args": { "<arg_name>": "<value>" }
}

User message: """${userMessage}"""
`;

    const geminiResponse = await model.generateContent(prompt);
    let text = geminiResponse.response.text().trim();

    console.log("🧠 Gemini raw response:", text);

    // 🧩 Clean possible Markdown formatting
    text = text
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    // 🧩 Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      throw new Error("Gemini returned invalid JSON: " + text);
    }

    const { tool, args } = parsed;
    if (!tool || typeof args !== "object") {
      throw new Error("Gemini did not provide valid tool or args.");
    }

    console.log(`⚙️ Calling MCP tool: ${tool} with args:`, args);

    // 🧩 Step 2: Call the MCP tool
    const result = await mcpClient.callTool({ name: tool, arguments: args });

    // 🧩 Step 3: Optionally summarize results with Gemini
    const summaryPrompt = `
You are a Meta Ads assistant. Summarize this MCP result in clear language.
Input:
${JSON.stringify(result, null, 2)}

Return short summary JSON like:
{
  "summary": "X active campaigns found.",
  "key_points": ["Campaign A - Active", "Campaign B - Paused"]
}
`;

    const summaryResponse = await model.generateContent(summaryPrompt);
    let summaryText = summaryResponse.response.text().trim();

    summaryText = summaryText
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    let summary;
    try {
      summary = JSON.parse(summaryText);
    } catch {
      summary = { summary: summaryText };
    }

    // 🧩 Step 4: Return combined result
    res.json({
      success: true,
      tool,
      args,
      raw: result,
      summary,
    });
  } catch (error) {
    console.error("❌ Error in /chat route:", error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(4000, () => console.log("🚀 Client backend running on http://localhost:4000"));

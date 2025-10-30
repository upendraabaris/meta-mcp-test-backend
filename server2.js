import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  try {
    // Path to the built MCP server script (after TypeScript compilation)
    // const transport = new StdioClientTransport({
    //   command: "node",
    //   args: [
    //     "F:/2025/PS/projects/meta-mcp/build/src/index.js", // 👈 adjust this to your built server path
    //   ],
    // });

    const transport = new StdioClientTransport({
      command: "npx",
      args: ["ts-node", "src/index.ts"],
      cwd: "F:/2025/PS/projects/meta-mcp", // server project root
    });

    const client = new Client({
      name: "meta-ads",
      version: "1.0.0",
    });

    await client.connect(transport);
    console.log("✅ Connected to Meta MCP server via stdio");

    // --- Example: list all tools
    const tools = await client.listTools();
    console.log("🧰 Available tools:", tools);

    // --- Example: call one tool
    const result = await client.callTool({
      name: "get_insights", // pick one from listTools()
      arguments: { campaign_id: "1234" }, // optional if tool doesn’t require args
    });

    console.log("📊 Tool result:", result);
  } catch (err) {
    console.error("❌ MCP client error:", err);
  }
}

main();

// // import { McpClient } from "@modelcontextprotocol/sdk/client/mcp.js";
// // import { McpClient } from "@modelcontextprotocol/sdk/client/mcp.js";
// import { McpClient } from "@modelcontextprotocol/sdk";
// // import { McpClient } from "@modelcontextprotocol/sdk/dist/esm/server/mcp.js";

// export default async function createMcpClient() {
//   try {
//     // Adjust the transport path to your actual MCP server setup
//     const client = await McpClient.connect({
//       name: "meta-ads-client",
//       version: "1.0.0",
//       transport: {
//         type: "stdio", // change to "websocket" or "unix" if needed
//         path: "/tmp/mcp-server.sock", // replace with your actual socket/transport
//       },
//     });

//     console.log("🔗 Connected to MCP server successfully");
//     return client;
//   } catch (err) {
//     console.error("❌ Error connecting to MCP server:", err);
//     throw err;
//   }
// }


// createMcpClient.js
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * Creates and connects an MCP client.
 * Make sure your MCP server (meta-mcp) is running locally.
 */
// export async function createMcpClient() {
//   try {
//     // Create a transport — this spawns your MCP server as a subprocess
//     const transport = new StdioClientTransport({
//       command: "node",
//       args: ["F:/2025/PS/projects/meta-mcp/index.ts"], // your MCP server entry file
//     });

//     // Create the client----
//     const client = new Client({
//       name: "meta-ads",
//       version: "1.0.0",
//     });

//     // Connect client to transport
//     await client.connect(transport);
//     console.log("🔗 Connected to local MCP server successfully");

//     return client;
//   } catch (err) {
//     console.error("❌ Failed to connect to MCP server:", err);
//     throw err;
//   }
// }


import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";
dotenv.config();
export async function createMcpClient() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["F:/2025/PS/projects/meta-mcp/build/src/index.js"], // path to your compiled MCP server
    env: {
    ...process.env, // inherit your .env
    META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN,
    META_APP_ID: process.env.META_APP_ID,
    META_APP_SECRET: process.env.META_APP_SECRET,
    MCP_SERVER_NAME: "meta-ads",
  },
  });

  const client = new Client({
    name: "meta-ads-client",
    version: "1.0.0",
  });

  await client.connect(transport);
  console.log("✅ Connected to Meta MCP Server");
  return client;
}

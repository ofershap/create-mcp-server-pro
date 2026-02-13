import type { ProjectOptions } from "../prompts.js";

export function indexTemplate(opts: ProjectOptions): string {
  const lines: string[] = [];

  lines.push(`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";`);
  lines.push(`import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";`);
  lines.push(`import { z } from "zod";`);
  lines.push(`import { greet, fetchData } from "./tools.js";`);

  if (opts.auth) {
    lines.push(``);
    lines.push(`function getToken(): string {`);
    lines.push(`  const token = process.env.API_TOKEN;`);
    lines.push(`  if (!token) {`);
    lines.push(`    throw new Error(`);
    lines.push(`      "API_TOKEN environment variable is required. " +`);
    lines.push(`        "Set it in your MCP client configuration.",`);
    lines.push(`    );`);
    lines.push(`  }`);
    lines.push(`  return token;`);
    lines.push(`}`);
  }

  lines.push(``);
  lines.push(`const server = new McpServer({`);
  lines.push(`  name: "${opts.name}",`);
  lines.push(`  version: "0.1.0",`);
  lines.push(`});`);
  lines.push(``);
  lines.push(`server.tool(`);
  lines.push(`  "hello",`);
  lines.push(`  "Say hello to someone",`);
  lines.push(`  {`);
  lines.push(`    name: z.string().describe("Name to greet"),`);
  lines.push(`  },`);
  lines.push(`  async ({ name }) => ({`);
  lines.push(`    content: [{ type: "text", text: greet(name) }],`);
  lines.push(`  }),`);
  lines.push(`);`);
  lines.push(``);
  lines.push(`server.tool(`);
  lines.push(`  "fetch_data",`);
  lines.push(`  "Fetch data from a URL and return the response",`);
  lines.push(`  {`);
  lines.push(`    url: z.string().url().describe("The URL to fetch"),`);
  lines.push(`  },`);
  lines.push(`  async ({ url }) => {`);

  if (opts.auth) {
    lines.push(`    const token = getToken();`);
    lines.push(`    void token;`);
  }

  lines.push(`    try {`);
  lines.push(`      const result = await fetchData(url);`);
  lines.push(`      return { content: [{ type: "text", text: result }] };`);
  lines.push(`    } catch (err) {`);
  lines.push(`      const message = err instanceof Error ? err.message : String(err);`);
  lines.push("      return {");
  lines.push("        content: [{ type: \"text\", text: `Error: ${message}` }],");
  lines.push(`        isError: true,`);
  lines.push(`      };`);
  lines.push(`    }`);
  lines.push(`  },`);
  lines.push(`);`);
  lines.push(``);
  lines.push(`async function main() {`);
  lines.push(`  const transport = new StdioServerTransport();`);
  lines.push(`  await server.connect(transport);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`main().catch((err) => {`);
  lines.push(`  console.error("Fatal error:", err);`);
  lines.push(`  process.exit(1);`);
  lines.push(`});`);
  lines.push(``);

  return lines.join("\n");
}

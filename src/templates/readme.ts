import type { ProjectOptions } from "../prompts.js";

export function readmeTemplate(opts: ProjectOptions): string {
  const repoOwner = opts.author || "USERNAME";
  const authSection = opts.auth
    ? `
## Authentication

This server requires an API token. Set the \`API_TOKEN\` environment variable in your MCP client configuration:

\`\`\`json
{
  "env": {
    "API_TOKEN": "your-token-here"
  }
}
\`\`\`
`
    : "";

  const envField = opts.auth
    ? `
      "env": {
        "API_TOKEN": "your-token-here"
      }`
    : "";

  const envFieldCursor = opts.auth
    ? `
        "env": {
          "API_TOKEN": "your-token-here"
        }`
    : "";

  return `# ${opts.name}

[![npm version](https://img.shields.io/npm/v/${opts.name}.svg)](https://www.npmjs.com/package/${opts.name})
[![npm downloads](https://img.shields.io/npm/dm/${opts.name}.svg)](https://www.npmjs.com/package/${opts.name})
[![CI](https://github.com/${repoOwner}/${opts.name}/actions/workflows/ci.yml/badge.svg)](https://github.com/${repoOwner}/${opts.name}/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

${opts.description}

> An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that provides tools for AI assistants like Claude, Cursor, and GitHub Copilot. Built with the official MCP SDK.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io) is an open standard that lets AI assistants connect to external tools and data sources. This server exposes tools that any MCP-compatible client can use.

## Tools

| Tool | Description |
|------|-------------|
| \`hello\` | Say hello to someone |
| \`fetch_data\` | Fetch data from a URL and return the response |

## Quick Start

### Claude Desktop

Add to \`~/Library/Application Support/Claude/claude_desktop_config.json\`:

\`\`\`json
{
  "mcpServers": {
    "${opts.name}": {
      "command": "npx",
      "args": ["-y", "${opts.name}"]${envField}
    }
  }
}
\`\`\`

### Cursor

Add to \`.cursor/mcp.json\` in your project:

\`\`\`json
{
  "mcpServers": {
    "${opts.name}": {
      "command": "npx",
      "args": ["-y", "${opts.name}"]${envFieldCursor}
    }
  }
}
\`\`\`

### VS Code (GitHub Copilot)

Add to \`.vscode/mcp.json\`:

\`\`\`json
{
  "servers": {
    "${opts.name}": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "${opts.name}"]
    }
  }
}
\`\`\`
${authSection}
## Development

\`\`\`bash
git clone https://github.com/${repoOwner}/${opts.name}.git
cd ${opts.name}
npm install
npm run build
npm test
\`\`\`

### Adding Tools

1. Add your tool logic in \`src/tools.ts\`
2. Register the tool in \`src/index.ts\` using \`server.tool()\`
3. Add tests in \`tests/tools.test.ts\`

### Best Practices

- **Use Zod schemas** for all tool inputs with \`.describe()\` on every field
- **Return \`isError: true\`** for user-facing errors so the AI can retry or report
- **Wrap external calls** in try/catch and return meaningful error messages
- **Keep tools focused** — one tool per action, not one tool that does everything

## License

MIT

---

*Scaffolded with [create-mcp-server-pro](https://github.com/ofershap/create-mcp-server-pro)*
`;
}

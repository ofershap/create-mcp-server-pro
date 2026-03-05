---
name: mcp-server-scaffolding
description: Scaffold production-ready MCP servers with TypeScript, tests, CI, and best practices. Use when building a new MCP server.
---

# MCP Server Scaffolding

Use this skill when you need to create a new MCP server from scratch. Generates a production-ready project with TypeScript, Vitest tests, GitHub Actions CI, and error handling patterns.

## Usage

```bash
npx create-mcp-server-pro my-server
```

### Non-Interactive (Agent-Friendly)

```bash
npx create-mcp-server-pro my-server \
  --name mcp-server-weather \
  --description "Weather forecasts for AI assistants" \
  --auth \
  --author "Your Name"
```

## What Gets Generated

- TypeScript with strict mode and MCP SDK v2
- Vitest test setup with a sample tool test
- GitHub Actions CI pipeline
- Error handling patterns (MCP-compliant error responses)
- Agent-friendly README with tool table, quick start, and examples
- ESLint 9 + Prettier config
- Optional auth boilerplate (API token validation)

## Key Patterns

- Pass `--auth` for servers that need an API token; `--no-auth` for zero-config servers
- The generated `src/index.ts` has a working example tool — replace it with your real tools
- Tests use `@modelcontextprotocol/sdk/test` utilities for MCP protocol-level testing
- The official MCP scaffolder was archived — this is the maintained replacement

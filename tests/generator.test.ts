import { describe, it, expect, afterEach } from "vitest";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { generateProject } from "../src/generator.js";
import type { ProjectOptions } from "../src/prompts.js";

function makeTmpDir(): string {
  const dir = join(tmpdir(), `mcp-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  return dir;
}

const defaultOpts: ProjectOptions = {
  directory: "test-server",
  name: "mcp-server-test",
  description: "A test MCP server",
  auth: false,
  author: "Test Author",
};

describe("generateProject", () => {
  const dirs: string[] = [];

  afterEach(() => {
    for (const dir of dirs) {
      rmSync(dir, { recursive: true, force: true });
    }
    dirs.length = 0;
  });

  it("creates all expected files", () => {
    const root = makeTmpDir();
    dirs.push(root);

    const created = generateProject(root, defaultOpts);

    expect(created).toContain("package.json");
    expect(created).toContain("tsconfig.json");
    expect(created).toContain("tsup.config.ts");
    expect(created).toContain("vitest.config.ts");
    expect(created).toContain("eslint.config.js");
    expect(created).toContain(".prettierrc.json");
    expect(created).toContain(".prettierignore");
    expect(created).toContain(".gitignore");
    expect(created).toContain("LICENSE");
    expect(created).toContain(".github/FUNDING.yml");
    expect(created).toContain(".husky/pre-commit");
    expect(created).toContain(".github/workflows/ci.yml");
    expect(created).toContain(".github/workflows/release.yml");
    expect(created).toContain("src/index.ts");
    expect(created).toContain("src/tools.ts");
    expect(created).toContain("tests/tools.test.ts");
    expect(created).toContain("README.md");
  });

  it("creates files on disk", () => {
    const root = makeTmpDir();
    dirs.push(root);

    generateProject(root, defaultOpts);

    expect(existsSync(join(root, "package.json"))).toBe(true);
    expect(existsSync(join(root, "src/index.ts"))).toBe(true);
    expect(existsSync(join(root, "src/tools.ts"))).toBe(true);
    expect(existsSync(join(root, "tests/tools.test.ts"))).toBe(true);
    expect(existsSync(join(root, ".github/workflows/ci.yml"))).toBe(true);
    expect(existsSync(join(root, "assets"))).toBe(true);
  });

  it("generates valid package.json with correct name", () => {
    const root = makeTmpDir();
    dirs.push(root);

    generateProject(root, defaultOpts);

    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));
    expect(pkg.name).toBe("mcp-server-test");
    expect(pkg.description).toBe("A test MCP server");
    expect(pkg.author).toBe("Test Author");
    expect(pkg.bin["mcp-server-test"]).toBe("./dist/index.js");
    expect(pkg.dependencies["@modelcontextprotocol/sdk"]).toBeDefined();
    expect(pkg.dependencies["zod"]).toBeDefined();
  });

  it("includes MCP SDK imports in generated index.ts", () => {
    const root = makeTmpDir();
    dirs.push(root);

    generateProject(root, defaultOpts);

    const indexContent = readFileSync(join(root, "src/index.ts"), "utf-8");
    expect(indexContent).toContain("McpServer");
    expect(indexContent).toContain("StdioServerTransport");
    expect(indexContent).toContain('name: "mcp-server-test"');
    expect(indexContent).toContain("server.tool(");
    expect(indexContent).toContain("isError: true");
  });

  it("includes fetch mock pattern in generated tests", () => {
    const root = makeTmpDir();
    dirs.push(root);

    generateProject(root, defaultOpts);

    const testContent = readFileSync(join(root, "tests/tools.test.ts"), "utf-8");
    expect(testContent).toContain("vi.spyOn(globalThis, \"fetch\")");
    expect(testContent).toContain("rejects.toThrow");
  });

  it("generates README with MCP explainer and quick start", () => {
    const root = makeTmpDir();
    dirs.push(root);

    generateProject(root, defaultOpts);

    const readme = readFileSync(join(root, "README.md"), "utf-8");
    expect(readme).toContain("# mcp-server-test");
    expect(readme).toContain("What is MCP?");
    expect(readme).toContain("Claude Desktop");
    expect(readme).toContain("Cursor");
    expect(readme).toContain("VS Code");
    expect(readme).toContain("create-mcp-server-pro");
  });

  it("includes auth boilerplate when auth is true", () => {
    const root = makeTmpDir();
    dirs.push(root);

    const authOpts = { ...defaultOpts, auth: true };
    generateProject(root, authOpts);

    const indexContent = readFileSync(join(root, "src/index.ts"), "utf-8");
    expect(indexContent).toContain("API_TOKEN");
    expect(indexContent).toContain("getToken");

    const toolsContent = readFileSync(join(root, "src/tools.ts"), "utf-8");
    expect(toolsContent).toContain("Authorization");

    const readme = readFileSync(join(root, "README.md"), "utf-8");
    expect(readme).toContain("Authentication");
    expect(readme).toContain("API_TOKEN");
  });

  it("excludes auth boilerplate when auth is false", () => {
    const root = makeTmpDir();
    dirs.push(root);

    generateProject(root, defaultOpts);

    const indexContent = readFileSync(join(root, "src/index.ts"), "utf-8");
    expect(indexContent).not.toContain("getToken");

    const readme = readFileSync(join(root, "README.md"), "utf-8");
    expect(readme).not.toContain("## Authentication");
  });

  it("generates correct CI workflow with node matrix", () => {
    const root = makeTmpDir();
    dirs.push(root);

    generateProject(root, defaultOpts);

    const ci = readFileSync(join(root, ".github/workflows/ci.yml"), "utf-8");
    expect(ci).toContain("node-version: [20, 22]");
    expect(ci).toContain("npm run lint");
    expect(ci).toContain("npm run typecheck");
    expect(ci).toContain("npm test");
  });

  it("generates tsup config with shebang banner", () => {
    const root = makeTmpDir();
    dirs.push(root);

    generateProject(root, defaultOpts);

    const tsup = readFileSync(join(root, "tsup.config.ts"), "utf-8");
    expect(tsup).toContain("#!/usr/bin/env node");
    expect(tsup).toContain('format: ["esm"]');
    expect(tsup).toContain('"node20"');
  });

  it("generates LICENSE with correct author and year", () => {
    const root = makeTmpDir();
    dirs.push(root);

    generateProject(root, defaultOpts);

    const license = readFileSync(join(root, "LICENSE"), "utf-8");
    expect(license).toContain("Test Author");
    expect(license).toContain(String(new Date().getFullYear()));
    expect(license).toContain("MIT License");
  });
});

import type { ProjectOptions } from "../prompts.js";

export function packageJsonTemplate(opts: ProjectOptions): string {
  const pkg = {
    name: opts.name,
    version: "0.1.0",
    description: opts.description,
    type: "module",
    bin: {
      [opts.name]: "./dist/index.js",
    },
    exports: {
      ".": {
        import: {
          types: "./dist/index.d.ts",
          default: "./dist/index.js",
        },
      },
    },
    files: ["dist"],
    scripts: {
      build: "tsup",
      typecheck: "tsc --noEmit",
      test: "vitest run",
      "test:watch": "vitest",
      "test:coverage": "vitest run --coverage",
      lint: "eslint . && prettier --check .",
      format: "prettier --write .",
      prepare: "husky",
    },
    "lint-staged": {
      "*.{ts,js}": ["eslint --fix", "prettier --write"],
      "*.{json,md,yml,yaml}": ["prettier --write"],
    },
    keywords: [
      "mcp",
      "model-context-protocol",
      "mcp-server",
      opts.name.replace("mcp-server-", ""),
      "ai",
      "agent",
    ],
    author: opts.author,
    license: "MIT",
    repository: {
      type: "git",
      url: `https://github.com/${opts.author || "USERNAME"}/${opts.name}.git`,
    },
    dependencies: {
      "@modelcontextprotocol/sdk": "^1.26.0",
      zod: "^3.25.0",
    },
    devDependencies: {
      "@eslint/js": "^9.21.0",
      "@types/node": "^22.0.0",
      "@vitest/coverage-v8": "^3.2.0",
      eslint: "^9.21.0",
      "eslint-config-prettier": "^10.0.0",
      husky: "^9.1.7",
      "lint-staged": "^15.4.3",
      prettier: "^3.5.3",
      tsup: "^8.4.0",
      typescript: "^5.7.3",
      "typescript-eslint": "^8.25.0",
      vitest: "^3.2.0",
    },
  };

  return JSON.stringify(pkg, null, 2) + "\n";
}

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { ProjectOptions } from "./prompts.js";
import { packageJsonTemplate } from "./templates/package-json.js";
import { tsconfigTemplate } from "./templates/tsconfig.js";
import { tsupConfigTemplate } from "./templates/tsup-config.js";
import { vitestConfigTemplate } from "./templates/vitest-config.js";
import { eslintConfigTemplate } from "./templates/eslint-config.js";
import { prettierConfigTemplate } from "./templates/prettier-config.js";
import { prettierIgnoreTemplate } from "./templates/prettier-ignore.js";
import { gitignoreTemplate } from "./templates/gitignore.js";
import { licenseTemplate } from "./templates/license.js";
import { fundingTemplate } from "./templates/funding.js";
import { huskyPreCommitTemplate } from "./templates/husky-pre-commit.js";
import { ciTemplate } from "./templates/ci.js";
import { releaseTemplate } from "./templates/release.js";
import { indexTemplate } from "./templates/index-ts.js";
import { toolsTemplate } from "./templates/tools-ts.js";
import { toolsTestTemplate } from "./templates/tools-test.js";
import { readmeTemplate } from "./templates/readme.js";

interface FileEntry {
  path: string;
  content: string;
}

function buildFileList(opts: ProjectOptions): FileEntry[] {
  return [
    { path: "package.json", content: packageJsonTemplate(opts) },
    { path: "tsconfig.json", content: tsconfigTemplate() },
    { path: "tsup.config.ts", content: tsupConfigTemplate() },
    { path: "vitest.config.ts", content: vitestConfigTemplate() },
    { path: "eslint.config.js", content: eslintConfigTemplate() },
    { path: ".prettierrc.json", content: prettierConfigTemplate() },
    { path: ".prettierignore", content: prettierIgnoreTemplate() },
    { path: ".gitignore", content: gitignoreTemplate() },
    { path: "LICENSE", content: licenseTemplate(opts) },
    { path: ".github/FUNDING.yml", content: fundingTemplate() },
    { path: ".husky/pre-commit", content: huskyPreCommitTemplate() },
    { path: ".github/workflows/ci.yml", content: ciTemplate() },
    { path: ".github/workflows/release.yml", content: releaseTemplate() },
    { path: "src/index.ts", content: indexTemplate(opts) },
    { path: "src/tools.ts", content: toolsTemplate(opts) },
    { path: "tests/tools.test.ts", content: toolsTestTemplate(opts) },
    { path: "README.md", content: readmeTemplate(opts) },
  ];
}

export function generateProject(root: string, opts: ProjectOptions): string[] {
  const files = buildFileList(opts);
  const created: string[] = [];

  for (const file of files) {
    const fullPath = join(root, file.path);
    mkdirSync(join(fullPath, ".."), { recursive: true });
    writeFileSync(fullPath, file.content, "utf-8");
    created.push(file.path);
  }

  mkdirSync(join(root, "assets"), { recursive: true });

  return created;
}

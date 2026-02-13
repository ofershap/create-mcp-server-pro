import { Command } from "commander";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { promptForOptions } from "./prompts.js";
import { generateProject } from "./generator.js";

const program = new Command();

program
  .name("create-mcp-server-pro")
  .description(
    "Scaffold a production-ready MCP server with the latest SDK, tests, CI, and best practices.",
  )
  .version("0.1.0")
  .argument("[directory]", "Directory to create the project in")
  .option("--name <name>", "Server name (npm package name)")
  .option("--description <desc>", "Server description")
  .option("--auth", "Include authentication boilerplate")
  .option("--no-auth", "Skip authentication boilerplate")
  .option("--author <author>", "Author name")
  .action(async (directory: string | undefined, flags: Record<string, unknown>) => {
    const dir = directory ?? "my-mcp-server";
    const root = resolve(process.cwd(), dir);

    if (existsSync(root)) {
      console.error(`\nError: Directory "${dir}" already exists.\n`);
      process.exit(1);
    }

    console.log("\n  create-mcp-server-pro\n");
    console.log("  Scaffold a production-ready MCP server.\n");

    const isNonInteractive =
      flags.name !== undefined && flags.description !== undefined;

    const opts = isNonInteractive
      ? {
          directory: dir,
          name: flags.name as string,
          description: flags.description as string,
          auth: flags.auth === true,
          author: (flags.author as string) ?? "",
        }
      : await promptForOptions({
          directory: dir,
          name: flags.name as string | undefined,
          description: flags.description as string | undefined,
          auth: typeof flags.auth === "boolean" ? flags.auth : undefined,
          author: flags.author as string | undefined,
        });

    const created = generateProject(root, opts);

    console.log(`\n  Created ${created.length} files in ${dir}/\n`);
    console.log("  Next steps:\n");
    console.log(`    cd ${dir}`);
    console.log("    npm install");
    console.log("    npm run build");
    console.log("    npm test\n");
    console.log("  Then add your tools in src/tools.ts and register them in src/index.ts.\n");
  });

program.parse();

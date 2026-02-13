import { input, confirm } from "@inquirer/prompts";

export interface ProjectOptions {
  directory: string;
  name: string;
  description: string;
  auth: boolean;
  author: string;
}

function toServerName(dir: string): string {
  const base = dir.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  return base.startsWith("mcp-server-") ? base : `mcp-server-${base}`;
}

export async function promptForOptions(
  partial: Partial<ProjectOptions> & { directory: string },
): Promise<ProjectOptions> {
  const defaultName = toServerName(partial.directory);

  const name =
    partial.name ??
    (await input({
      message: "Server name (npm package name):",
      default: defaultName,
    }));

  const description =
    partial.description ??
    (await input({
      message: "Description:",
      default: "A production-ready MCP server",
    }));

  const auth =
    partial.auth ??
    (await confirm({
      message: "Does it need authentication? (e.g. API token)",
      default: false,
    }));

  const author =
    partial.author ??
    (await input({
      message: "Author:",
      default: "",
    }));

  return { directory: partial.directory, name, description, auth, author };
}

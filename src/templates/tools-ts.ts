import type { ProjectOptions } from "../prompts.js";

export function toolsTemplate(opts: ProjectOptions): string {
  const lines: string[] = [];

  lines.push(`export function greet(name: string): string {`);
  lines.push(`  return \`Hello, \${name}! Welcome to ${opts.name}.\`;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export async function fetchData(url: string): Promise<string> {`);

  if (opts.auth) {
    lines.push(`  const token = process.env.API_TOKEN;`);
    lines.push(`  const headers: Record<string, string> = token`);
    lines.push("    ? { Authorization: `Bearer ${token}` }");
    lines.push(`    : {};`);
  } else {
    lines.push(`  const headers: Record<string, string> = {};`);
  }

  lines.push(``);
  lines.push(`  const response = await fetch(url, { headers });`);
  lines.push(``);
  lines.push(`  if (!response.ok) {`);
  lines.push(
    "    throw new Error(`HTTP ${response.status}: ${response.statusText}`);",
  );
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  const contentType = response.headers.get("content-type") ?? "";`);
  lines.push(``);
  lines.push(`  if (contentType.includes("application/json")) {`);
  lines.push(`    const json = await response.json();`);
  lines.push(`    return JSON.stringify(json, null, 2);`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  return await response.text();`);
  lines.push(`}`);
  lines.push(``);

  return lines.join("\n");
}

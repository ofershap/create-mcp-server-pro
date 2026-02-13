export function prettierConfigTemplate(): string {
  const config = {
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    printWidth: 80,
    tabWidth: 2,
  };

  return JSON.stringify(config, null, 2) + "\n";
}

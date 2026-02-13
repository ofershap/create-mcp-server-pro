export function gitignoreTemplate(): string {
  return `node_modules
dist
coverage
*.tsbuildinfo
.env
.env.*
!.env.example
`;
}

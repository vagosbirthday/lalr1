export interface Production {
  lhs: string;
  rhs: string[];
}

export function parseGrammar(input: string): Production[] {
  const lines = input.trim().split("\n");

  const productions: Production[] = [];

  for (const line of lines) {
    const parts = line.split("->");

    const lhs = parts[0].trim();
    const rhs = parts[1].trim().split(" ");

    productions.push({ lhs, rhs });
  }

  return productions;
}
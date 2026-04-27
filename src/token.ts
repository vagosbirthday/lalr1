export type TokenType =
  | "NUMBER"
  | "IDENTIFIER"
  | "STRING"
  | "CHAR"
  | "BOOLEAN"
  | "KEYWORD"
  | "OPERATOR"
  | "OPEN"
  | "CLOSE"
  | "SEPARATOR";

export interface Token {
  value: string;
  type: TokenType;
  line: number;
}
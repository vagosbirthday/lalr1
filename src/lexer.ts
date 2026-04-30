// import { Token, TokenType } from "./token.js";

// const KEYWORDS = new Set([
//   "var", "if", "elif", "else", "loop", "break", "return",
//   "inc", "dec", "and", "or", "not", "true", "false",
// ]);

// const stack: string[] = [];

// function isAlpha(char: string) {
//   return /[a-zA-Z_]/.test(char);
// }

// function isInt(char: string) {
//   return /[0-9]/.test(char);
// }

// function isWhitespace(char: string) {
//   return /\s/.test(char);
// }

// export function tokenize(input: string): Token[] {
//   const tokens: Token[] = [];
//   const src = input.split("");
//   let line = 1;

//   function push(value: string, type: TokenType) {
//     tokens.push({ value, type, line });
//   }

//   while (src.length > 0) {
//     let char = src[0]!;

//     if (char === "\n") {
//       line++;
//       src.shift();
//     }

//     else if (isWhitespace(char)) {
//       src.shift();
//     }

//     else if (char === "/" && src[1] === "/") {
//       while (src.length > 0 && src[0] !== "\n") {
//         src.shift();
//       }
//     }

//     else if (char === "/" && src[1] === "*") {
//       src.shift(); src.shift();

//       while (src.length > 1) {
//         const a: string = src[0]!;
//         const b: string = src[1]!;

//         if (a === "*" && b === "/") break;
//         if (a === "\n") line++;

//         src.shift();
//       }

//       src.shift(); src.shift();
//     }

//     else if (char === '"') {
//       src.shift();
//       let value = "";

//       while (src.length > 0 && src[0] !== '"') {
//         value += src.shift()!;
//       }

//       src.shift();
//       push(value, "STRING");
//     }

//     else if (char === "'") {
//       src.shift();
//       let value = "";

//       while (src.length > 0 && src[0] !== "'") {
//         value += src.shift()!;
//       }

//       src.shift();
//       push(value, "CHAR");
//     }

//     else if (isInt(char) || (char === "-" && isInt(src[1] ?? ""))) {
//       let value = "";

//       if (char === "-") value += src.shift()!;

//       while (src.length > 0 && isInt(src[0]!)) {
//         value += src.shift()!;
//       }

//       push(value, "NUMBER");
//     }

//     else if (isAlpha(char)) {
//       let value = "";

//       while (src.length > 0 && /[a-zA-Z0-9_]/.test(src[0]!)) {
//         value += src.shift()!;
//       }

//       if (value === "true" || value === "false") {
//         push(value, "BOOLEAN");
//       }
//       else if (KEYWORDS.has(value)) {
//         push(value, "KEYWORD");
//       }
//       else {
//         push(value, "IDENTIFIER");
//       }
//     }

//     else if (char === "(" || char === "[" || char === "{") {
//       stack.push(char);
//       push(`${stack.length}${char}`, "OPEN");
//       src.shift();
//     }

//     else if (char === ")" || char === "]" || char === "}") {
//       push(`${stack.length}${char}`, "CLOSE");
//       stack.pop();
//       src.shift();
//     }

//     else if (
//       (char === "=" && src[1] === "=") ||
//       (char === "!" && src[1] === "=") ||
//       (char === "<" && src[1] === "=") ||
//       (char === ">" && src[1] === "=")
//     ) {
//       push(char + src[1]!, "OPERATOR");
//       src.shift(); src.shift();
//     }

//     else if ("+-*/%<>=!".includes(char)) {
//       push(char, "OPERATOR");
//       src.shift();
//     }

//     else if (char === "," || char === ";") {
//       push(char, "SEPARATOR");
//       src.shift();
//     }

//     else {
//       throw new Error(`Unknown character '${char}' at line ${line}`);
//     }
//   }

//   return tokens;
// }

import { Token, TokenType } from "./token.js";

const KEYWORDS = new Set([
  "var",
  "if",
  "elif",
  "else",
  "loop",
  "break",
  "return",
  "inc",
  "dec",
  "and",
  "or",
  "not",
]);

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const src = input.split("");
  let line = 1;

  function push(value: string, type: string) {
    tokens.push({ value, type: type as any, line });
  }

  while (src.length > 0) {
    let char = src[0]!;

    if (char === "\n") {
      line++;
      src.shift();
      continue;
    }
    if (/\s/.test(char)) {
      src.shift();
      continue;
    }

    // 2. Comentarios
    if (char === "/" && src[1] === "/") {
      while (src.length > 0 && src[0] !== "\n") src.shift();
      continue;
    }
    if (char === "/" && src[1] === "*") {
      src.shift();
      src.shift();
      while (src.length > 0) {
        if ((src[0] as string) === "*" && (src[1] as string) === "/") {
          src.shift();
          src.shift();
          break;
        }
        if (src.shift() === "\n") line++;
      }
      continue;
    }

    // 3. Literales de String -> "lit_str"
    if (char === '"') {
      src.shift();
      let value = "";
      while (src.length > 0 && src[0] !== '"') {
        let c = src.shift()!;
        if (c === "\\") {
          value += c;
          if (src[0] === "u") {
            // Consumir 'u' y los 6 hex dígitos
            for (let k = 0; k < 7; k++) {
              if (src.length > 0) value += src.shift();
            }
          } else if (src.length > 0) {
            value += src.shift();
          }
        } else {
          value += c;
          if (c === "\n") line++;
        }
      }
      if (src.length === 0)
        throw new Error(`❌ Error Léxico: String no cerrado en línea ${line}`);
      src.shift();
      push(value, "lit_str");
      continue;
    }

    // 4. Literales de Carácter -> "lit_char"
    if (char === "'") {
      src.shift();
      let value = "";
      if (src[0] === "\\") {
        value += src.shift(); // Consumir \
        if (String(src[0]) === "u") {
          // Caso Unicode: \u + 6 caracteres hexadecimales
          for (let k = 0; k < 7; k++) {
            // 'u' + 6 dígitos
            if (src.length > 0) value += src.shift();
          }
        } else {
          value += src.shift(); // Escape simple (\n, \t, etc)
        }
      } else {
        value += src.shift(); // Carácter normal
      }

      if (src[0] !== "'") {
        throw new Error(
          `❌ Error Léxico: Carácter mal formado en línea ${line}. Se esperaba ' pero se encontró ${src[0]}`,
        );
      }
      src.shift();
      push(value, "lit_char");
      continue;
    }
    // 5. Números -> "lit_int"
    if (/[0-9]/.test(char)) {
      let value = "";
      while (src.length > 0 && /[0-9]/.test(src[0]!)) value += src.shift()!;
      push(value, "lit_int");
      continue;
    }

    // 6. Identificadores y Keywords
    if (/[a-zA-Z_]/.test(char)) {
      let value = "";
      while (src.length > 0 && /[a-zA-Z0-9_]/.test(src[0]!))
        value += src.shift()!;

      if (value === "true" || value === "false") {
        push(value, "lit_bool");
      } else if (KEYWORDS.has(value)) {
        push(value, value);
      } else {
        push(value, "id");
      }
      continue;
    }

    // 7. Operadores Compuestos (Corregido para no duplicar)
    const next = src[1];
    if (
      (char === "=" || char === "!" || char === "<" || char === ">") &&
      next === "="
    ) {
      src.shift();
      src.shift();
      const op = char + "=";
      push(op, op);
      continue;
    }

    // 8. Símbolos de un solo carácter
    if ("()[]{},;+-*/%<>=!".includes(char)) {
      push(char, char);
      src.shift();
      continue;
    }

    throw new Error(`Unknown character '${char}' at line ${line}`);
  }

  push("$", "$");
  return tokens;
}

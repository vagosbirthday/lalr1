// import { parseGrammar } from "./grammar.js";
// import { computeFirst, computeFollow } from "./firstFollow.js";
// import { printStates } from "./printStates.js";
// import { buildLR1 } from "./lr1.js";
// import { mergeLALR } from "./lalr.js";
// import { buildTable } from "./table.js";
// import { parse } from "./runtimeParser.js";
// import { printTable } from "./printTable.js";

import { parse } from "./runtimeParser.js";
import { productions } from "./production.js";
import { loadTableFromCSV } from "./generateTableFromCSV.js";

// const grammarText = `
// S' -> S
// S -> a b
// C -> c d
// C -> e
// `;

// const grammar = parseGrammar(grammarText);

// console.log("GRAMMAR:", grammar);

// const first = computeFirst(grammar);
// console.log("FIRST:", first);

// const follow = computeFollow(grammar, "S'");
// console.log("FOLLOW:", follow);

// const lr1 = buildLR1(grammar);
// console.log("LR1 STATES:", lr1);

// const lalr = mergeLALR(lr1);
// console.log("LALR STATES:", lalr);
// printStates(lalr);

// const { ACTION, GOTO } = buildTable(lalr, grammar);

// console.log("ACTION:", ACTION);
// console.log("GOTO:", GOTO);
// printTable(ACTION, GOTO);

// parse(["a", "b", "$"], ACTION, GOTO, grammar);

const inputTokens = [
  "id", // main
  "(",
  ")",
  "{",
  "id", // prints
  "(",
  "lit_str", // "hello, world\n"
  ")",
  ";", // El primer ; cierra la llamada a función (stmt_fun_call)
  ";", // El segundo ; es un stmt_empty
  ";",";",";",";",";",";",";",";",";",";",";",";",";",";",";",";",";",";",";",";",";",";",";", // El tercer ; es un stmt_empty
  "return",
  "lit_int", // 42
  ";", // El primer ; cierra el return (stmt_return)
  ";", // El segundo ; es un stmt_empty
  ";", // El tercer ; es un stmt_empty
  "}",
  "$", // Fin de archivo obligatorio
];

import path from "path";
import { fileURLToPath } from "url";

// Esto ayuda a obtener la ruta actual si usas ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { ACTION, GOTO } = await loadTableFromCSV(
  path.join(__dirname, "./Tabla_analisis_sintactico_Quetzal.csv"),
);



try {
    console.log("Analizando tokens:", inputTokens);
  const correct = parse(inputTokens, ACTION, GOTO);
    if (correct) {
        console.log("\nAnálisis sintáctico completado: La cadena es CORRECTA.✅✅✅✅✅✅✅✅✅✅✅ ASI EMOJIS BIEN CHATGPT ✅✅✅✅✅✅✅✅");
    } else {
        console.log("\nAnálisis sintáctico completado: La cadena es INCORRECTA.");
    }
} catch (e) {
  console.error("Error durante el análisis.");
}

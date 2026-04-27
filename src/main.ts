import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import { tokenize } from "./lexer";
// import { Token } from "./token.ts";
import { parse } from "./runtimeParser";
import { loadTableFromCSV } from "./generateTableFromCSV";

// --- Configuración de rutas ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const file = process.argv[2];

if (!file) {
  console.error("❌ Error: Debes proporcionar un archivo .quetzal");
  console.error("Usa: npx ts-node src/main.ts archivo.quetzal");
  process.exit(1);
}

async function runCompiler() {
  try {
    // 1. Leer el código fuente
    const code = fs.readFileSync(file, "utf-8");

    // 2. Ejecutar el Lexer
    console.log("--- Iniciando Análisis Léxico ---");
    const rawTokens = tokenize(code);

    // Imprimir resumen de tokens para depuración
    rawTokens.forEach((t) => {
      console.log(`[Lexer] Line: ${t.line} | Type: ${t.type.padEnd(10)} | Value: ${t.value}`);
    });

    // 3. Preparar los tokens para el Parser
    // Convertimos de Token[] a string[] (ej: ["id", "(", "lit_str", ")", ";"])
    const tokenTypes = rawTokens.map(t => t.type);

    // Agregamos el símbolo de fin de archivo si el lexer no lo puso
    // if (tokenTypes[tokenTypes.length - 1] !== "$") {
    //   tokenTypes.push("$");
    // }

    // 4. Cargar la Tabla SLR (TSV)
    const tablePath = path.join(__dirname, "./Tabla_analisis_sintactico_Quetzal.csv");
    const { ACTION, GOTO } = await loadTableFromCSV(tablePath);

    console.log("\n--- Iniciando Análisis Sintáctico ---");

    // 5. Ejecutar el Parser
    const correct = parse(tokenTypes, ACTION, GOTO);

    if (correct) {
      console.log("\n✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅");
      console.log("ANÁLISIS SINTÁCTICO COMPLETADO: LA CADENA ES CORRECTA");
      console.log("✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅");
    } else {
      console.log("\n❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
      console.log("ANÁLISIS SINTÁCTICO COMPLETADO: LA CADENA ES INCORRECTA");
      console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
    }

  } catch (error: any) {
    console.error("\n💥 Error crítico durante la compilación:");
    console.error(error.message);
  }
}

// Ejecutar el proceso
runCompiler();
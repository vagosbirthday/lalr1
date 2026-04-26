import { productions } from "./production.js";

export function parse(
  tokens: string[],
  ACTION: any,
  GOTO: any
): boolean {
  // Asegurar que el flujo termine en $
  if (tokens[tokens.length - 1] !== "$") {
    tokens.push("$");
  }

  const stateStack: number[] = [0];
  const symbolStack: string[] = ["$"]; // Pila de símbolos para visualización
  let i = 0;

  // Encabezados de la tabla de traza
  // console.log(
  //   `${"PILA (Estados y Símbolos)".padEnd(50)} | ${"CADENA".padEnd(30)} | ${"ACCIÓN"}`
  // );
  // console.log("-".repeat(110));

  while (true) {
    const currentState = stateStack[stateStack.length - 1];
    const currentToken = tokens[i];
    const action = ACTION[currentState]?.[currentToken];

    // Formatear la pila combinada para imprimir: [0 var 6 id 10]
    const combinedStack = stateStack
      .map((st, idx) => `${st}${symbolStack[idx] !== "$" ? ` ${symbolStack[idx]}` : ""}`)
      .join(" ");
    
    // Formatear la cadena restante
    const remainingInput = tokens.slice(i).join(" ");

    if (!action) {
      // console.log(`${combinedStack.padEnd(50)} | ${remainingInput.padEnd(30)} | ❌ ERROR`);
      console.error(`\nError sintáctico: No se esperaba "${currentToken}" en el estado ${currentState}`);
      return false;
    }

    // --- CASO SHIFT ---
    if (action.startsWith("s")) {
      const nextState = parseInt(action.substring(1));
      
      // console.log(`${combinedStack.padEnd(50)} | ${remainingInput.padEnd(30)} | Shift s${nextState}`);

      stateStack.push(nextState);
      symbolStack.push(currentToken); // Guardamos el token en la pila de símbolos
      i++;
    } 

    // --- CASO REDUCE ---
    else if (action.startsWith("r")) {
      const ruleIndex = parseInt(action.substring(1));
      const prod = productions[ruleIndex];

      if (!prod) {
        console.error(`Regla r${ruleIndex} no encontrada.`);
        return false;
      }

      // console.log(
      //   `${combinedStack.padEnd(50)} | ${remainingInput.padEnd(30)} | Reduce r${ruleIndex} (${prod.lhs} -> ${prod.rhs.join(" ") || "ε"})`
      // );

      // Sacar de ambas pilas
      const elementsToPop = prod.rhs.length;
      for (let j = 0; j < elementsToPop; j++) {
        stateStack.pop();
        symbolStack.pop();
      }

      // Consultar GOTO
      const stateAfterPop = stateStack[stateStack.length - 1];
      const gotoState = GOTO[stateAfterPop]?.[prod.lhs];

      if (gotoState === undefined) {
        console.error(`Error GOTO: No hay transición para ${prod.lhs} desde estado ${stateAfterPop}`);
        return false;
      }

      stateStack.push(gotoState);
      symbolStack.push(prod.lhs); // Metemos el No Terminal en la pila de símbolos
    } 

    // --- CASO ACCEPT ---
    else if (action === "acc") {
      // console.log(`${combinedStack.padEnd(50)} | ${remainingInput.padEnd(30)} | ✅ ACCEPT`);
      return true;
    }
  }
}
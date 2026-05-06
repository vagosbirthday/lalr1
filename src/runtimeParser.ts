import { productions } from "./production";

export function parse(tokens: string[], ACTION: any, GOTO: any): boolean {
  const stateStack: number[] = [0];
  const symbolStack: string[] = ["$"];
  let i = 0;
  let opsWithoutAdvance = 0; // Contador de seguridad

  console.log(
    `${"PILA (Estados y Símbolos)".padEnd(50)} | ${"CADENA".padEnd(30)} | ${"ACCIÓN"}`
  );
  console.log("-".repeat(110));

  while (true) {
    const currentState = stateStack[stateStack.length - 1];
    const currentToken = tokens[i];
    const remainingInput = tokens.slice(i).join(" ");
    const combinedStack = stateStack
      .map((st, idx) => `${st}${symbolStack[idx] !== "$" ? ` ${symbolStack[idx]}` : ""}`)
      .join(" ");
    const action = ACTION[currentState]?.[currentToken];

    // --- SEGURIDAD: Evitar congelamiento ---
    opsWithoutAdvance++;
    if (opsWithoutAdvance > 500) { 
      console.error("\n💥 Error: Posible bucle infinito de reducciones detectado en el estado", currentState);
      return false;
    }

    if (!action) {
      console.error(`\n❌ Error sintáctico: No se esperaba "${currentToken}" en el estado ${currentState}`);
      return false;
    }

    if (action.startsWith("s")) {
      const nextState = parseInt(action.substring(1));
       console.log(`${combinedStack.padEnd(50)} | ${remainingInput.padEnd(30)} | Shift s${nextState}`);
      stateStack.push(nextState);
      symbolStack.push(currentToken);
      i++;
      opsWithoutAdvance = 0; // Reseteamos al avanzar el token
    } 
    else if (action.startsWith("r")) {
      const ruleIndex = parseInt(action.substring(1));
      const prod = productions[ruleIndex];
      
      console.log(
        `${combinedStack.padEnd(50)} | ${remainingInput.padEnd(30)} | Reduce r${ruleIndex} (${prod.lhs} -> ${prod.rhs.join(" ") || "ε"})`
      );

      const elementsToPop = prod.rhs.length;
      for (let j = 0; j < elementsToPop; j++) {
        stateStack.pop();
        symbolStack.pop();
      }

      const stateAfterPop = stateStack[stateStack.length - 1];
      const gotoState = GOTO[stateAfterPop]?.[prod.lhs];

      if (gotoState === undefined) {
        console.error(`Error GOTO: No hay salto para ${prod.lhs} desde ${stateAfterPop}`);
        return false;
      }
      stateStack.push(gotoState);
      symbolStack.push(prod.lhs);
      // No incrementamos i en reduce, ni reseteamos el contador todavía
    } 
    else if (action === "acc") {
      console.log(`${combinedStack.padEnd(50)} | ${remainingInput.padEnd(30)} | ✅ ACCEPT`);
      return true;
    }
  }
}
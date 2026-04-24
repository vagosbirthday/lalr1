export function printTable(ACTION: any, GOTO: any) {
  console.log("\nLR TABLE\n");

  const states = Object.keys(ACTION);

  // Obtener todos los símbolos
  const terminals = new Set<string>();
  const nonTerminals = new Set<string>();

  for (const s of states) {
    for (const a in ACTION[s]) {
      terminals.add(a);
    }
    for (const g in GOTO[s]) {
      nonTerminals.add(g);
    }
  }

  const termList = Array.from(terminals);
  const nonTermList = Array.from(nonTerminals);

  // Header
  let header = "State\t";

  termList.forEach(t => header += t + "\t");
  nonTermList.forEach(nt => header += nt + "\t");

  console.log(header);

  // Filas
  states.forEach(s => {
    let row = s + "\t";

    // ACTION
    termList.forEach(t => {
      const act = ACTION[s][t];

      if (!act) {
        row += "\t";
      } else if (act.type === "shift") {
        row += "s" + act.to + "\t";
      } else if (act.type === "reduce") {
        row += "r" + act.rule + "\t";
      } else if (act.type === "accept") {
        row += "acc\t";
      }
    });

    // GOTO
    nonTermList.forEach(nt => {
      const g = GOTO[s][nt];
      row += (g !== undefined ? g : "") + "\t";
    });

    console.log(row);
  });
}
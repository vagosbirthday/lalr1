import fs from 'fs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function loadTableFromCSV(filePath: string) {
  const DELIMITER = '\t'; 
  
  const csv = fs.readFileSync(filePath, 'utf8');
  const lines = csv.trim().split(/\r?\n/);

  // 1. Obtener headers y la frontera '$'
  const headers = lines[1].split(DELIMITER).map(h => h.trim());
  const dollarIndex = headers.indexOf('$');

  const ACTION: any = {};
  const GOTO: any = {};

  console.log(`Delimitador: TABULADOR | Índice de $: ${dollarIndex}`);

  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split(DELIMITER).map(c => c.trim());
    const state = cells[0];

    if (state === undefined || state === "") continue;

    ACTION[state] = {};
    GOTO[state] = {};

    // --- CAMBIO CLAVE ---
    // Iteramos basándonos en 'headers.length' para asegurar 
    // que revisamos todas las columnas aunque la fila sea corta
    for (let j = 1; j < headers.length; j++) {
      const cell = cells[j];
      const header = headers[j];

      // Ignorar si la celda está vacía o tiene el espacio raro de Excel
      if (!cell || cell === "" || cell === " ") continue;

      if (j <= dollarIndex) {
        ACTION[state][header] = cell;
      } else {
        // Guardar el número de estado en GOTO
        GOTO[state][header] = parseInt(cell);
      }
    }
  }

  return { ACTION, GOTO };
}
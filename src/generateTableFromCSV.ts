import fs from 'fs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function loadTableFromCSV(filePath: string) {
const rl = readline.createInterface({ input, output });

// 1. El delimitador de tabulador se representa como '\t'
const DELIMITER = '\t';

const csv = fs.readFileSync(filePath, 'utf8');
// Dividimos por saltos de línea (compatible con CRLF de Windows y LF de Linux)
const lines = csv.trim().split(/\r?\n/);

// 2. Extraer headers usando el tabulador
// Es vital que la línea de headers también esté separada por tabs
const headers = lines[1].split(DELIMITER).map(h => h.trim());
const dollarIndex = headers.indexOf('$');

const ACTION: any = {};
const GOTO: any = {};

console.log(`Delimitador: TABULADOR | Índice de $: ${dollarIndex}`);

for (let i = 2; i < lines.length; i++) {
// Dividimos la fila de datos por tabulador
const cells = lines[i].split(DELIMITER).map(c => c.trim());
const state = cells[0];


if (state === undefined || state === "") continue;

if (!ACTION[state]) ACTION[state] = {};
if (!GOTO[state]) GOTO[state] = {};

for (let j = 1; j < cells.length; j++) {
  const cell = cells[j];
  const header = headers[j];

  if (!cell || !header) continue;

  if (j <= dollarIndex) {
    ACTION[state][header] = cell;
  } else {
    // En GOTO guardamos números (estados destino)
    GOTO[state][header] = parseInt(cell);
  }
}

// console.log(`indice de $: ${dollarIndex}, headers length: ${headers.length}, cells length: ${cells.length}`);

// console.log(`Headers:`, headers);

// console.log(`Procesando estado ${state} con celdas:`, cells);

// console.log(`ACTION[${state}]:`, ACTION[state]);

// console.log(`GOTO[${state}]:`, GOTO[state]);

// await rl.question('Presiona [ENTER] para continuar...');

}

rl.close();
return { ACTION, GOTO };
}
import { parseGrammar } from "./grammar.js";
import { computeFirst, computeFollow } from "./firstFollow.js";
import { printStates } from "./printStates.js";
import { buildLR1 } from "./lr1.js";
import { mergeLALR } from "./lalr.js";
import { buildTable } from "./table.js";
import { parse } from "./runtimeParser.js";
import { printTable } from "./printTable.js";


const grammarText = `
S' -> S
S -> a b
C -> c d
C -> e
`;

const grammar = parseGrammar(grammarText);

console.log("GRAMMAR:", grammar);

const first = computeFirst(grammar);
console.log("FIRST:", first);

const follow = computeFollow(grammar, "S'");
console.log("FOLLOW:", follow);

const lr1 = buildLR1(grammar);
console.log("LR1 STATES:", lr1);

const lalr = mergeLALR(lr1);
console.log("LALR STATES:", lalr);
printStates(lalr);

const { ACTION, GOTO } = buildTable(lalr, grammar);

console.log("ACTION:", ACTION);
console.log("GOTO:", GOTO);
printTable(ACTION, GOTO);

parse(["a", "b", "$"], ACTION, GOTO, grammar);
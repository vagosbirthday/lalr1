import { Item } from "./lr1.js";
import { goto } from "./lr1.js";
import { Production } from "./grammar.js";

export function buildTable(states: Item[][], prods: Production[]) {
  const ACTION: any = {};
  const GOTO: any = {};

  states.forEach((state, i) => {
    ACTION[i] = {};
    GOTO[i] = {};

    for (const item of state) {
      if (item.dot < item.rhs.length) {
        const sym = item.rhs[item.dot];

        if (sym === sym.toLowerCase()) {
          const nextState = states.findIndex(s =>
            JSON.stringify(s) === JSON.stringify(
              goto(state, sym, prods)
            )
          );

          ACTION[i][sym] = {
            type: "shift",
            to: nextState
          };
        } else {
          const nextState = states.findIndex(s =>
            JSON.stringify(s) === JSON.stringify(
              goto(state, sym, prods)
            )
          );

          GOTO[i][sym] = nextState;
        }
      } else {
        if (item.lhs === "S'") {
          ACTION[i]["$"] = { type: "accept" };
        } else {
          const ruleIndex = prods.findIndex(
            p =>
              p.lhs === item.lhs &&
              p.rhs.join(" ") === item.rhs.join(" ")
          );

          ACTION[i][item.lookahead] = {
            type: "reduce",
            rule: ruleIndex
          };
        }
      }
    }
  });

  return { ACTION, GOTO };
}
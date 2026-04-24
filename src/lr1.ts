import { Production } from "./grammar.js";

export interface Item {
  lhs: string;
  rhs: string[];
  dot: number;
  lookahead: string;
}

function equals(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function closure(items: Item[], prods: Production[]): Item[] {
  const result = [...items];

  let changed = true;

  while (changed) {
    changed = false;

    for (const item of result) {
      const symbol = item.rhs[item.dot];

      if (!symbol) continue;

      for (const p of prods) {
        if (p.lhs === symbol) {
          const newItem: Item = {
            lhs: p.lhs,
            rhs: p.rhs,
            dot: 0,
            lookahead: item.lookahead,
          };

          if (!result.find(i => equals(i, newItem))) {
            result.push(newItem);
            changed = true;
          }
        }
      }
    }
  }

  return result;
}

export function goto(items: Item[], symbol: string, prods: Production[]) {
  const moved: Item[] = [];

  for (const i of items) {
    if (i.rhs[i.dot] === symbol) {
      moved.push({
        lhs: i.lhs,
        rhs: i.rhs,
        dot: i.dot + 1,
        lookahead: i.lookahead,
      });
    }
  }

  return closure(moved, prods);
}

export function buildLR1(prods: Production[]) {
  const states: Item[][] = [];

  const start: Item = {
    lhs: prods[0].lhs,
    rhs: prods[0].rhs,
    dot: 0,
    lookahead: "$",
  };

  const startState = closure([start], prods);

  states.push(startState);

  for (let i = 0; i < states.length; i++) {
    const state = states[i];

    const symbols: string[] = [];

    for (const item of state) {
      for (const s of item.rhs) {
        if (!symbols.includes(s)) {
          symbols.push(s);
        }
      }
    }

    for (const sym of symbols) {
      const next = goto(state, sym, prods);

      if (next.length === 0) continue;

      if (!states.find(s => equals(s, next))) {
        states.push(next);
      }
    }
  }

  return states;
}
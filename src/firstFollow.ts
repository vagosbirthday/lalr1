import { Production } from "./grammar.js";

export function computeFirst(prods: Production[]) {
  const first: any = {};

  for (const p of prods) {
    first[p.lhs] = first[p.lhs] || [];
  }

  let changed = true;

  while (changed) {
    changed = false;

    for (const p of prods) {
      const symbol = p.rhs[0];

      if (!first[p.lhs].includes(symbol)) {
        first[p.lhs].push(symbol);
        changed = true;
      }
    }
  }

  return first;
}

export function computeFollow(prods: Production[], start: string) {
  const follow: any = {};

  for (const p of prods) {
    follow[p.lhs] = follow[p.lhs] || [];
  }

  follow[start].push("$");

  let changed = true;

  while (changed) {
    changed = false;

    for (const p of prods) {
      for (let i = 0; i < p.rhs.length; i++) {
        const B = p.rhs[i];

        if (!follow[B]) continue;

        if (i + 1 < p.rhs.length) {
          const next = p.rhs[i + 1];

          if (!follow[B].includes(next)) {
            follow[B].push(next);
            changed = true;
          }
        } else {
          for (const f of follow[p.lhs]) {
            if (!follow[B].includes(f)) {
              follow[B].push(f);
              changed = true;
            }
          }
        }
      }
    }
  }

  return follow;
}
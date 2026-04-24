import { Item } from "./lr1.js";

export function mergeLALR(states: Item[][]) {
  const groups: any = {};

  for (const state of states) {
    const key = state
      .map(i => `${i.lhs}->${i.rhs.join(" ")}@${i.dot}`)
      .sort()
      .join("|");

    if (!groups[key]) groups[key] = [];

    groups[key].push(state);
  }

  const result: Item[][] = [];

  for (const key in groups) {
    const merged: Item[] = [];

    for (const state of groups[key]) {
      for (const item of state) {
        if (!merged.find(i => JSON.stringify(i) === JSON.stringify(item))) {
          merged.push(item);
        }
      }
    }

    result.push(merged);
  }

  return result;
}
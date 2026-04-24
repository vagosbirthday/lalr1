export function printStates(states: any[]) {
  console.log("\nLALR(1) STATES\n");

  states.forEach((state, i) => {
    console.log(`State ${i}`);

    state.forEach((item: any) => {
      const left = item.lhs;
      const before = item.rhs.slice(0, item.dot).join(" ");
      const after = item.rhs.slice(item.dot).join(" ");

      console.log(
        `${left} -> ${before} • ${after}, ${item.lookahead}`
      );
    });

    console.log("");
  });
}
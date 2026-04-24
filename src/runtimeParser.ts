export function parse(
  tokens: string[],
  ACTION: any,
  GOTO: any,
  productions: any
) {
  const stack = [0];
  let i = 0;

  while (true) {
    const state = stack[stack.length - 1];
    const token = tokens[i];

    console.log("STACK:", stack, "TOKEN:", token);
    const action = ACTION[state]?.[token];

    if (!action) {
      console.log("Error");
      return;
    }

    if (action.type === "shift") {
      stack.push(action.to);
      i++;
    }

    else if (action.type === "reduce") {
      const prod = productions[action.rule];

      for (let j = 0; j < prod.rhs.length; j++) {
        stack.pop();
      }

      const newState = stack[stack.length - 1];
      const goto = GOTO[newState][prod.lhs];

      stack.push(goto);
    }

    else if (action.type === "accept") {
      console.log("Aceptado");
      return;
    }
  }
}
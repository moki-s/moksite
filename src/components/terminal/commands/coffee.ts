import type { Command, Output } from "../registry";

export const coffee: Command = {
  name: "coffee",
  description: "brew one",
  run: () => {
    const out: Output = [
      {
        kind: "ascii",
        text: "    ( (\n     ) )\n  ........\n  |      |]\n  \\      /\n   `----'",
      },
      { kind: "text", text: "fuel acquired.", tone: "signal" },
    ];
    return out;
  },
};

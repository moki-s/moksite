import type { Command } from "../registry";

export const exit: Command = {
  name: "exit",
  description: "close the terminal",
  run: (_args, ctx) => {
    ctx.close();
    return [];
  },
};

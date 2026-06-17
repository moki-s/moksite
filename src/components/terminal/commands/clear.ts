import type { Command } from "../registry";

export const clear: Command = {
  name: "clear",
  description: "clear the screen",
  run: (_args, ctx) => {
    ctx.clear();
    return [];
  },
};

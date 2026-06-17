import type { Command } from "../registry";

export const theme: Command = {
  name: "theme",
  description: "toggle high-contrast mode",
  run: (_args, ctx) => {
    ctx.toggleTheme();
    return [
      { kind: "text", text: "high-contrast mode toggled (persists).", tone: "signal" },
    ];
  },
};

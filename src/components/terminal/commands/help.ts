import type { Command } from "../registry";

export const help: Command = {
  name: "help",
  description: "list all commands",
  run: (_args, ctx) => [
    { kind: "text", text: "available commands:", tone: "signal" },
    ...ctx.commands.map((command) => ({
      kind: "text" as const,
      text: `  ${command.name.padEnd(14)}${command.description}`,
    })),
  ],
};

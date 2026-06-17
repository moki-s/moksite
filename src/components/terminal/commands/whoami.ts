import type { Command } from "../registry";
import { terminalBio } from "@/content/site";

export const whoami: Command = {
  name: "whoami",
  description: "who is this?",
  run: () => terminalBio.map((line) => ({ kind: "text" as const, text: line })),
};

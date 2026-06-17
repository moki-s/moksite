// §5.7 — pure-TS command registry. Types live here; each command is its own file
// in ./commands and is registered below. Output is an array of typed lines.

export type CaseMeta = { slug: string; title: string; year: number; order: number };

export type OutputLine =
  | { kind: "text"; text: string; tone?: "default" | "rain" | "signal" | "blood" }
  | { kind: "link"; text: string; href: string; external?: boolean }
  | { kind: "ascii"; text: string };

export type Output = OutputLine[];

export type TerminalCtx = {
  close: () => void;
  clear: () => void;
  navigate: (href: string) => void; // closes terminal + routes
  downloadCv: () => void;
  scrollToSignal: () => void; // closes terminal + scrolls to #signal
  toggleTheme: () => void;
  cases: CaseMeta[];
  commands: { name: string; description: string }[];
};

export type Command = {
  name: string;
  description: string;
  run: (args: string[], ctx: TerminalCtx) => Output | Promise<Output>;
};

import { help } from "./commands/help";
import { whoami } from "./commands/whoami";
import { cases } from "./commands/cases";
import { open } from "./commands/open";
import { stack } from "./commands/stack";
import { cv } from "./commands/cv";
import { contact } from "./commands/contact";
import { socials } from "./commands/socials";
import { theme } from "./commands/theme";
import { sudo } from "./commands/sudo";
import { coffee } from "./commands/coffee";
import { clear } from "./commands/clear";
import { exit } from "./commands/exit";

export const commands: Command[] = [
  help,
  whoami,
  cases,
  open,
  stack,
  cv,
  contact,
  socials,
  theme,
  sudo,
  coffee,
  clear,
  exit,
];

export const commandMap: Map<string, Command> = new Map(
  commands.map((command) => [command.name, command]),
);

export const UNKNOWN_LINE: OutputLine = {
  kind: "text",
  text: "command not found — try 'help'. even vigilantes read the manual.",
  tone: "blood",
};

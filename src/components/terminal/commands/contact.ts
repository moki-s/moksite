import type { Command } from "../registry";
import { siteConfig } from "@/content/site";

export const contact: Command = {
  name: "contact",
  description: "send a signal",
  run: (_args, ctx) => {
    ctx.scrollToSignal();
    return [
      { kind: "text", text: `email: ${siteConfig.email}` },
      { kind: "text", text: "opening the signal panel…", tone: "signal" },
    ];
  },
};

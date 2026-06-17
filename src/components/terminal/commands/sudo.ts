import type { Command, Output } from "../registry";
import { siteConfig } from "@/content/site";

// §5.7 — `sudo hire-me` prints a playful offer-letter template; bare `sudo` gets
// the classic refusal.
export const sudo: Command = {
  name: "sudo",
  description: "sudo hire-me — request an offer letter",
  run: (args) => {
    if ((args[0] ?? "").toLowerCase() !== "hire-me") {
      return [{ kind: "text", text: "nice try. you don't have root here.", tone: "rain" }];
    }
    const out: Output = [
      { kind: "text", text: "OFFER LETTER — DRAFT", tone: "signal" },
      { kind: "text", text: "--------------------------------", tone: "rain" },
      { kind: "text", text: `CANDIDATE: ${siteConfig.name}` },
      { kind: "text", text: "ROLE:      the problem nobody else will own" },
      { kind: "text", text: "START:     immediately. the signal's on." },
      { kind: "text", text: "" },
      { kind: "text", text: "type 'contact' to make it official.", tone: "signal" },
    ];
    return out;
  },
};

import type { Command } from "../registry";

export const open: Command = {
  name: "open",
  description: "open a case — open <id|slug>",
  run: (args, ctx) => {
    const query = (args[0] ?? "").toLowerCase();
    if (!query) {
      return [{ kind: "text", text: "usage: open <id|slug>", tone: "blood" }];
    }
    const found = ctx.cases.find(
      (c) =>
        c.slug === query ||
        String(c.order) === query ||
        String(c.order).padStart(3, "0") === query,
    );
    if (!found) {
      return [{ kind: "text", text: `no case "${query}". try 'cases'.`, tone: "blood" }];
    }
    ctx.navigate(`/case/${found.slug}`);
    return [{ kind: "text", text: `opening ${found.title}…`, tone: "signal" }];
  },
};

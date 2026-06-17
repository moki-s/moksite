import type { Command, Output } from "../registry";

export const cases: Command = {
  name: "cases",
  description: "list the case files",
  run: (_args, ctx) => {
    if (ctx.cases.length === 0) {
      return [{ kind: "text", text: "no case files on record." }];
    }
    const out: Output = [{ kind: "text", text: "ID   YEAR  TITLE", tone: "rain" }];
    for (const c of ctx.cases) {
      out.push({
        kind: "text",
        text: `${String(c.order).padStart(3, "0")}  ${c.year}  ${c.title}`,
      });
    }
    out.push({ kind: "text", text: "→ open <id|slug> to view a case", tone: "rain" });
    return out;
  },
};

import type { Command, Output } from "../registry";
import { arsenal } from "@/content/site";

export const stack: Command = {
  name: "stack",
  description: "the arsenal, as a tree",
  run: () => {
    const out: Output = [];
    arsenal.forEach((group) => {
      out.push({ kind: "text", text: group.group, tone: "signal" });
      group.items.forEach((item, i) => {
        const branch = i === group.items.length - 1 ? "└─" : "├─";
        out.push({ kind: "text", text: `  ${branch} ${item.name}` });
      });
    });
    return out;
  },
};

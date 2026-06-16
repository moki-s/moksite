import { Boxes, Code, Server, Wrench, type LucideIcon } from "lucide-react";
import { Panel } from "@/components/panels/Panel";
import { arsenal } from "@/content/site";

// §5.5 — Panel 3, The Arsenal. Equipment grid, grouped, lucide icons, no skill
// bars. Items/field-use lines live in site.ts as [TODO-CONTENT] until approved.
const ICONS: Record<string, LucideIcon> = { Code, Boxes, Server, Wrench };

export function Arsenal() {
  return (
    <Panel
      id="arsenal"
      ariaLabel="The arsenal"
      eyebrow="PANEL 03 — THE ARSENAL"
      transition="halftone"
    >
      <h2 className="section-title">The Arsenal</h2>
      <div className="arsenal-grid">
        {arsenal.map((group) => (
          <div key={group.group} className="arsenal-group">
            <h3 className="arsenal-group-title">{group.group}</h3>
            <ul>
              {group.items.map((item, i) => {
                const Icon = ICONS[item.icon] ?? Wrench;
                return (
                  <li key={i} className="arsenal-item">
                    <Icon className="arsenal-icon" strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <p className="arsenal-name">{item.name}</p>
                      <p className="arsenal-fielduse">{item.fieldUse}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}

import { Bot, Code, Database, Workflow, type LucideIcon } from "lucide-react";
import { Panel } from "@/components/panels/Panel";
import { EvidenceLayerLazy } from "@/components/game/EvidenceLayerLazy";
import { arsenal } from "@/content/site";

// §5.5 — Panel 3, The Arsenal. Equipment grid, grouped, lucide icons, no skill
// bars. Skill names come from the CV; field-use lines are seeded/[TODO-CONTENT].
const ICONS: Record<string, LucideIcon> = { Code, Bot, Database, Workflow };

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
                const Icon = ICONS[item.icon] ?? Workflow;
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
      <EvidenceLayerLazy panel="arsenal" />
    </Panel>
  );
}

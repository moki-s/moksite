import type { Command } from "../registry";

// Unlocked only after all 7 hidden props are found (gated in Terminal.tsx). Hidden
// from `help` and tab-complete until then. Original noir ASCII (§15) — no franchise.
const ART = String.raw`
        \    |    /
         \   |   /            .·.
    ______\__|__/__________________
   |  |##|  |  | |##|  |  | |##|   |
   |##|  | |##| |  | |##| |  | |## |
   |__|__|_|__|_|__|_|__|_|__|_|___|
`;

export const vigilante: Command = {
  name: "vigilante",
  description: "[classified] — the evidence is all in",
  run: () => [
    { kind: "ascii", text: ART },
    { kind: "text", text: "seven clues, one detective. the city sleeps — you don't.", tone: "signal" },
    { kind: "text", text: "case closed. now go ship something.", tone: "rain" },
  ],
};

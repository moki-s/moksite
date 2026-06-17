import type { Command } from "../registry";

export const cv: Command = {
  name: "cv",
  description: "download the CV (PDF)",
  run: (_args, ctx) => {
    ctx.downloadCv();
    return [{ kind: "text", text: "fetching /cv.pdf …", tone: "signal" }];
  },
};

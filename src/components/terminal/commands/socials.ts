import type { Command } from "../registry";
import { siteConfig } from "@/content/site";

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

export const socials: Command = {
  name: "socials",
  description: "github + linkedin",
  run: () => [
    {
      kind: "link",
      text: strip(siteConfig.socials.github),
      href: siteConfig.socials.github,
      external: true,
    },
    {
      kind: "link",
      text: strip(siteConfig.socials.linkedin),
      href: siteConfig.socials.linkedin,
      external: true,
    },
  ],
};

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://north-business-os.mew-77.chatgpt.site";
  return ["", "/nl", "/da", "/no", "/sv", "/ie"].map((path, index) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: index === 0 ? 1 : .9,
    alternates: { languages: { en: base, "en-IE": `${base}/ie`, "nl-NL": `${base}/nl`, "da-DK": `${base}/da`, "nb-NO": `${base}/no`, "sv-SE": `${base}/sv` } }
  }));
}

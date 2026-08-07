import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://webesign.vercel.app";
  return ["", "/nl", "/da", "/no", "/sv", "/ie", "/solutions/construction-os", "/solutions/manufacturing-os", "/solutions/distribution-os", "/solutions/logistics-os", "/solutions/property-management-os"].map((path, index) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: index === 0 ? 1 : .9,
    alternates: { languages: { en: base, "en-IE": `${base}/ie`, "en-NL": `${base}/nl`, "en-DK": `${base}/da`, "en-NO": `${base}/no`, "en-SE": `${base}/sv` } }
  }));
}

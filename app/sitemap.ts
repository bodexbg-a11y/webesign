import type { MetadataRoute } from "next";
import { SITE_URL, marketAlternates, markets, services } from "./seo-data";

const solutionPaths = [
  "/solutions/manufacturing-os",
  "/solutions/distribution-os",
  "/solutions/logistics-os",
  "/solutions/property-management-os",
];

const primaryPaths = [
  "/construction",
  "/construction-os",
  "/solutions",
  "/about",
  "/contact",
  "/privacy",
  "/cookies",
  "/terms",
  "/legal",
];

const lastModified = new Date("2026-08-20");

export default function sitemap(): MetadataRoute.Sitemap {
  const alternates = Object.fromEntries(
    Object.entries(marketAlternates).map(([language, path]) => [language, `${SITE_URL}${path === "/" ? "" : path}`]),
  );

  const home: MetadataRoute.Sitemap = [{
    url: SITE_URL,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: { languages: alternates },
  }];

  const marketPages: MetadataRoute.Sitemap = Object.keys(markets).map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
    alternates: { languages: alternates },
  }));

  const primaryPages: MetadataRoute.Sitemap = primaryPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/construction" || path === "/construction-os" || path === "/solutions" ? "weekly" : "monthly",
    priority: path === "/construction" ? 0.95 : path === "/construction-os" ? 0.9 : path === "/solutions" ? 0.9 : 0.6,
  }));

  const servicePages: MetadataRoute.Sitemap = Object.keys(services).map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const solutionPages: MetadataRoute.Sitemap = solutionPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...home, ...primaryPages, ...marketPages, ...servicePages, ...solutionPages];
}

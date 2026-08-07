import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://north-business-os.mew-77.chatgpt.site/sitemap.xml", host: "https://north-business-os.mew-77.chatgpt.site" };
}

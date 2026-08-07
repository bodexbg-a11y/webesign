import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://webesign.vercel.app"),
  title: { default: "Business Operating System & Automation Software | NORTH/OS", template: "%s | NORTH/OS" },
  description: "Modular Business Operating Systems for growing companies. Custom CRM, workflow automation, industry modules and AI—from €5,000.",
  keywords: ["business operating system", "business automation software", "custom business software", "custom CRM development", "ERP development", "workflow automation", "business process automation", "AI business automation", "custom ERP", "operations management software"],
  alternates: { canonical: "/", languages: { "en": "/", "en-IE": "/ie", "en-NL": "/nl", "en-DK": "/da", "en-NO": "/no", "en-SE": "/sv", "x-default": "/" } },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "NORTH/OS — One system to run your entire business", description: "A modular Business Operating System for growing companies. Packages from €5,000.", type: "website", images: [{ url: "/og.png", width: 1732, height: 909, alt: "NORTH/OS Business Operating System" }] },
  twitter: { card: "summary_large_image", title: "NORTH/OS — Business Operating System", description: "One system to run your entire business. Packages from €5,000.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

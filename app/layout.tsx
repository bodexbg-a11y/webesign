import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://webesign.vercel.app"),
  title: { default: "Business Operating System & Automation Software | NORTH/OS", template: "%s | NORTH/OS" },
  description: "Custom Business Operating Systems for growing companies. Connect CRM, operations, employees, finance, documents, integrations and AI in one platform.",
  keywords: ["business operating system", "business automation software", "custom business software", "custom CRM development", "ERP development", "workflow automation", "business process automation", "AI business automation", "custom ERP", "operations management software"],
  alternates: { canonical: "/", languages: { "en": "/", "en-IE": "/ie", "en-NL": "/nl", "en-DK": "/da", "en-NO": "/no", "en-SE": "/sv", "x-default": "/" } },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "NORTH/OS — Custom Business Operating Systems", description: "One connected platform for your entire business: CRM, operations, employees, finance, documents, integrations and AI.", type: "website", images: [{ url: "/og.png", width: 1732, height: 909, alt: "NORTH/OS Business Operating System" }] },
  twitter: { card: "summary_large_image", title: "NORTH/OS — Custom Business Operating Systems", description: "Everything that runs your business. Connected.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConsentManager from "./components/ConsentManager";
import { SITE_URL, marketAlternates } from "./seo-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans-premium", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Business Operating System for Growing Companies | OPSYNQ", template: "%s | OPSYNQ" },
  description: "Custom Business Operating Systems for growing companies. Connect CRM, operations, employees, finance, documents, integrations and AI in one platform.",
  keywords: ["business operating system", "business automation software", "custom business software", "custom CRM development", "ERP development", "workflow automation", "business process automation", "AI business automation", "custom ERP", "operations management software"],
  alternates: { canonical: "/", languages: marketAlternates },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "business software",
  creator: "OPSYNQ",
  publisher: "OPSYNQ",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "256x256" }],
    shortcut: "/favicon.png",
    apple: [{ url: "/favicon.png", type: "image/png", sizes: "256x256" }],
  },
  openGraph: { title: "OPSYNQ — Business Operating Systems", description: "One connected platform for your entire business: CRM, operations, employees, finance, documents, integrations and AI.", type: "website", url: SITE_URL, siteName: "OPSYNQ", images: [{ url: "/og.png", width: 1731, height: 909, alt: "OPSYNQ Business Operating System" }] },
  twitter: { card: "summary_large_image", title: "OPSYNQ — Business Operating Systems", description: "Everything that runs your business. Connected.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable}><body>{children}<ConsentManager /></body></html>;
}

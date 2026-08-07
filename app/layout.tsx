import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://north-os.com"),
  title: { default: "NORTH/OS — Custom Business Operating Systems", template: "%s — NORTH/OS" },
  description: "Premium custom business software for companies that have outgrown spreadsheets and disconnected tools.",
  keywords: ["custom business software", "Business Operating System", "custom CRM", "ERP development", "business automation"],
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "NORTH/OS — Your business. One intelligent system.", description: "Custom Business Operating Systems for complex, growing companies.", type: "website", images: [{ url: "/og.png", width: 1732, height: 909, alt: "NORTH/OS Custom Business Operating Systems" }] },
  twitter: { card: "summary_large_image", title: "NORTH/OS — Custom Business Operating Systems", description: "Your business. One intelligent system.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}

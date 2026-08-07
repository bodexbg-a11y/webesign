import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function LegalShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <main className="legal-page">
      <SiteHeader />
      <header className="legal-hero shell"><div className="eyebrow"><i /> {eyebrow}</div><h1>{title}</h1><p>{intro}</p></header>
      <article className="legal-document shell">{children}</article>
      <SiteFooter />
    </main>
  );
}

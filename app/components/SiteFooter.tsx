import Link from "next/link";
import { Brand } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div><Brand /><p>Custom Business Operating Systems for companies that have outgrown spreadsheets and disconnected software.</p></div>
        <div><b>Product</b><Link href="/solutions">Solutions</Link><Link href="/construction-os">Construction OS</Link><Link href="/services/business-automation-software">Business Automation</Link><Link href="/services/custom-crm-development">Custom CRM</Link></div>
        <div><b>Company</b><Link href="/about">About</Link><Link href="/contact">Contact / Book a Demo</Link><Link href="/nl">Netherlands</Link><Link href="/no">Norway</Link><Link href="/sv">Sweden</Link><Link href="/da">Denmark</Link></div>
        <div><b>Legal</b><Link href="/privacy">Privacy Policy</Link><Link href="/cookies">Cookie Policy</Link><Link href="/terms">Terms of Use</Link><Link href="/legal">Legal Notice</Link></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 OPSYNQ. All rights reserved.</span><span>English-language service across Northern Europe</span><span>Business systems, not websites.</span></div>
    </footer>
  );
}

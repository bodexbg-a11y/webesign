import Link from "./SafeLink";
import { Brand } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div><Brand /><p>Custom Business Operating Systems for companies that have outgrown spreadsheets and disconnected software.</p></div>
        <div><b>Product</b><Link href="/solutions">Solutions</Link><Link href="/construction-os">Construction OS</Link><Link href="/services/business-automation-software">Business Automation</Link><Link href="/services/custom-crm-development">Custom CRM</Link></div>
        <div><b>Company</b><Link href="/about">About</Link><Link href="/contact">Contact / Book a Demo</Link></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 OPSYNQ OS. All rights reserved.</span><span className="footer-legal-links"><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link><Link href="/legal">Legal Notice</Link></span></div>
    </footer>
  );
}

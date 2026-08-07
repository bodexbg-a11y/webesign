import Link from "./SafeLink";
import Image from "next/image";

export function Brand({ href = "/" }: { href?: string }) {
  return <Link className="brand" href={href} aria-label="OPSYNQ home"><span className="brand-logo" aria-hidden="true"><Image src="/opsynq-logo.png" width={68} height={34} alt="" /></span>OP<span>SYNQ</span></Link>;
}

export default function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="nav shell" aria-label="Main navigation">
        <Brand />
        <div className="nav-links">
          <Link href="/construction-os">Construction OS</Link>
          <Link href="/solutions">Solutions</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <Link className="nav-cta" href="/contact">Book a demo <span>↗</span></Link>
      </nav>
    </header>
  );
}

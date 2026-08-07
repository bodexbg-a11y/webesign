"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type SafeLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

export default function SafeLink({ href, children, onClick, ...props }: SafeLinkProps) {
  function followLink(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !href.startsWith("/")
    ) return;

    event.preventDefault();
    event.stopPropagation();
    window.location.assign(href);
  }

  return <a href={href} onClick={followLink} {...props}>{children}</a>;
}

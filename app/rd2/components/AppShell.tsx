"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useRd2 } from "../lib/store";
import EmployeePanel from "./EmployeePanel";

const NAV = [
  { href: "/rd2", icon: "▦", label: "Графік" },
  { href: "/rd2/calendar", icon: "▤", label: "Календар відпусток" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { status } = useRd2();

  return (
    <div className="rd2-layout" data-collapsed={collapsed}>
      <aside className="rd2-aside" data-collapsed={collapsed}>
        <div className="rd2-brand">
          <span className="rd2-brand-mark">РД2</span>
          {!collapsed && (
            <span className="rd2-brand-text">
              <b>Графік РД-2</b>
              <span>Розстановка РЦ-2</span>
            </span>
          )}
          <button
            type="button"
            className="rd2-collapse"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Розгорнути меню" : "Згорнути меню"}
            title={collapsed ? "Розгорнути меню" : "Згорнути меню"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="rd2-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} title={item.label}>
              <i aria-hidden="true">{item.icon}</i>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {!collapsed && <EmployeePanel />}
      </aside>

      <div className="rd2-main">{children}</div>

      {status && (
        <div className="rd2-toast" data-kind={status.kind} role="status">
          {status.text}
        </div>
      )}
    </div>
  );
}

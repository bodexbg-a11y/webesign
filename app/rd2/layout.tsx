import type { Metadata } from "next";
import "./rd2.css";
import AppShell from "./components/AppShell";
import { Rd2Provider } from "./lib/store";

export const metadata: Metadata = {
  title: "Графік РД-2 — розстановка персоналу",
  description: "Візуалізація розстановки оперативного персоналу РЦ-2 та календар відпусток.",
  robots: { index: false, follow: false },
};

export default function Rd2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rd2">
      <Rd2Provider>
        <AppShell>{children}</AppShell>
      </Rd2Provider>
    </div>
  );
}

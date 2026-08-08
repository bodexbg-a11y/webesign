type IconProps = { className?: string };
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function IconLayers(p: IconProps) { return <svg {...base} {...p}><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="M3 12l9 5 9-5" /><path d="M3 16l9 5 9-5" /></svg>; }
export function IconRoute(p: IconProps) { return <svg {...base} {...p}><circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="18" r="2.4" /><path d="M8.2 7.3 12 12l3.8 3" /></svg>; }
export function IconBolt(p: IconProps) { return <svg {...base} {...p}><path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" /></svg>; }
export function IconPlug(p: IconProps) { return <svg {...base} {...p}><path d="M9 3v5M15 3v5M6.5 8h11l-1 5a6 6 0 0 1-9 0l-1-5Z" /><path d="M12 17v4" /></svg>; }
export function IconShield(p: IconProps) { return <svg {...base} {...p}><path d="M12 3 5 6v6c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6l-7-3Z" /><path d="m9.3 12.2 2 2 3.4-3.8" /></svg>; }
export function IconExpand(p: IconProps) { return <svg {...base} {...p}><path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6" /></svg>; }
export function IconScatter(p: IconProps) { return <svg {...base} {...p}><rect x="3" y="4" width="6" height="6" rx="1.2" /><rect x="14" y="5" width="6" height="6" rx="1.2" /><rect x="8" y="14" width="6" height="6" rx="1.2" /></svg>; }
export function IconClock(p: IconProps) { return <svg {...base} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>; }
export function IconAlert(p: IconProps) { return <svg {...base} {...p}><path d="M12 3.5 21 19H3L12 3.5Z" /><path d="M12 10v4" /><circle cx="12" cy="16.6" r=".15" fill="currentColor" /></svg>; }
export function IconUsers(p: IconProps) { return <svg {...base} {...p}><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.6-3.3 2.9-5 5.5-5s4.9 1.7 5.5 5" /><circle cx="17" cy="9" r="2.4" /><path d="M15.8 14.2c2.1.3 3.7 1.8 4.2 4.3" /></svg>; }
export function IconKanban(p: IconProps) { return <svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v10" /></svg>; }
export function IconCoins(p: IconProps) { return <svg {...base} {...p}><ellipse cx="9" cy="7" rx="6" ry="3" /><path d="M3 7v6c0 1.7 2.7 3 6 3s6-1.3 6-3V7" /><path d="M9 13v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4M21 9.5c0 1.7-2.7 3-6 3" /></svg>; }
export function IconFile(p: IconProps) { return <svg {...base} {...p}><path d="M7 3h7l5 5v13H7V3Z" /><path d="M14 3v5h5" /><path d="M9.5 13h5M9.5 16.5h5" /></svg>; }
export function IconBox(p: IconProps) { return <svg {...base} {...p}><path d="m3.5 7 8.5-4.5L20.5 7 12 11.5 3.5 7Z" /><path d="M3.5 7v10l8.5 4.5M20.5 7v10L12 21.5M12 11.5V21.5" /></svg>; }
export function IconSparkle(p: IconProps) { return <svg {...base} {...p}><path d="M12 3c.6 3.2 1.8 4.4 5 5-3.2.6-4.4 1.8-5 5-.6-3.2-1.8-4.4-5-5 3.2-.6 4.4-1.8 5-5Z" /><path d="M19 14c.3 1.4.8 1.9 2.2 2.2-1.4.3-1.9.8-2.2 2.2-.3-1.4-.8-1.9-2.2-2.2 1.4-.3 1.9-.8 2.2-2.2Z" /></svg>; }
export function IconGrid(p: IconProps) { return <svg {...base} {...p}><rect x="3.5" y="3.5" width="7" height="7" rx="1.2" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.2" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.2" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.2" /></svg>; }
export function IconPuzzle(p: IconProps) { return <svg {...base} {...p}><path d="M9 4h4v2.2a1.8 1.8 0 1 0 0 3.6V12h-3.2a1.8 1.8 0 1 0 0 4H10v4H4v-6h2.2a1.8 1.8 0 1 0 0-4H4V4h5Z" /><path d="M13 12h3.8a1.8 1.8 0 1 1 0-4H20v6h-4v2.2a1.8 1.8 0 1 1-3.6 0V14" /></svg>; }
export function IconMegaphone(p: IconProps) { return <svg {...base} {...p}><path d="M3 10v4h3l6 4V6l-6 4H3Z" /><path d="M14 9a3.5 3.5 0 0 1 0 6M17 6.5a7 7 0 0 1 0 11" /></svg>; }
export function IconCrane(p: IconProps) { return <svg {...base} {...p}><path d="M5 21V6l9-3v5" /><path d="M14 8h7M17 8v4.5" /><path d="M17 12.5 12 15" /><path d="M12 15v6M5 21h14" /></svg>; }
export function IconFactory(p: IconProps) { return <svg {...base} {...p}><path d="M4 21V11l5 3v-3l5 3v-3l4 2.4V21H4Z" /><path d="M8 21v-4M13 21v-4M17.5 21v-4" /></svg>; }
export function IconTruck(p: IconProps) { return <svg {...base} {...p}><path d="M3 7h10v10H3z" /><path d="M13 10h4l3 3v4h-7z" /><circle cx="7" cy="18.5" r="1.6" /><circle cx="17" cy="18.5" r="1.6" /></svg>; }
export function IconHome(p: IconProps) { return <svg {...base} {...p}><path d="m4 11 8-7 8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-6h4v6" /></svg>; }
export function IconBriefcase(p: IconProps) { return <svg {...base} {...p}><rect x="3" y="7.5" width="18" height="12" rx="1.8" /><path d="M8.5 7.5V5.8A1.8 1.8 0 0 1 10.3 4h3.4a1.8 1.8 0 0 1 1.8 1.8V7.5" /><path d="M3 12.5h18" /></svg>; }
export function IconClipboard(p: IconProps) { return <svg {...base} {...p}><rect x="5" y="4.5" width="14" height="17" rx="1.8" /><rect x="9" y="3" width="6" height="3" rx="1" /><path d="M8.5 11h7M8.5 14.5h7M8.5 18h4.5" /></svg>; }
export function IconChart(p: IconProps) { return <svg {...base} {...p}><path d="M4 20V9M11 20V4M18 20v-7" /><path d="M2.5 20h19" /></svg>; }

import Image from "next/image";

export default function DashboardPreview() {
  return (
    <div className="dashboard-wrap" aria-label="OPSYNQ Construction OS — live product screenshot">
      <div className="dashboard-glow" />
      <div className="dashboard-frame">
        <div className="product-browser-bar"><i /><i /><i /><span>OPSYNQ / Executive Dashboard</span><b>EXAMPLE BUILD</b></div>
        <div className="dashboard-frame-image">
          <Image src="/product/construction-dashboard.jpg" width={2200} height={1206} priority sizes="(max-width: 900px) 100vw, 56vw" alt="OPSYNQ Construction OS executive dashboard with projects, crews, revenue, profit, invoices and cash position" />
        </div>
      </div>
      <div className="float-card fc-one"><span>AI AUTOMATION</span><b>14.2 hrs</b><small>saved this week</small></div>
      <div className="float-card fc-two"><i>✓</i><span><b>Workflow complete</b><small>Purchase order #2048</small></span></div>
    </div>
  );
}

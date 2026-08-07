import Image from "next/image";

export default function DashboardPreview() {
  return (
    <div className="dashboard-wrap" aria-label="OPSYNQ Business Operating System dashboard preview">
      <div className="dashboard-glow" />
      <div className="dashboard">
        <aside><div className="dash-brand"><span className="dash-brand-logo"><Image src="/opsynq-logo.png" width={50} height={25} alt="" /></span></div><div className="side-icon active">⌂</div><div className="side-icon">◎</div><div className="side-icon">▣</div><div className="side-icon">◇</div><div className="side-icon">≡</div><div className="avatar">AK</div></aside>
        <div className="dash-main">
          <header><div><small>EXECUTIVE OVERVIEW</small><h3>Good morning, Alex.</h3></div><button>+ New report</button></header>
          <div className="metrics"><div><span>Revenue</span><b>€482.6k</b><small className="up">↗ 12.4%</small></div><div><span>Active projects</span><b>38</b><small>7 due soon</small></div><div><span>Operating margin</span><b>24.8%</b><small className="up">↗ 3.2%</small></div></div>
          <div className="dash-grid">
            <div className="chart-card"><div className="card-head"><div><small>PERFORMANCE</small><b>Revenue overview</b></div><span>Last 6 months⌄</span></div><div className="chart"><div className="axis"><i>500k</i><i>300k</i><i>100k</i></div><div className="bars">{[42,58,47,69,63,88,77,94,82,100].map((height,index)=><i key={index} style={{height:`${height}%`}} />)}</div></div><div className="months"><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div></div>
            <div className="activity"><div className="card-head"><div><small>LIVE</small><b>Recent activity</b></div><i className="pulse" /></div>{[["NW","Northwind","Invoice paid","€18,400"],["AL","Atlas Labs","Project approved","Today"],["VB","Vertex Build","Contract signed","09:42"]].map((item)=><div className="activity-row" key={item[0]}><i>{item[0]}</i><span><b>{item[1]}</b><small>{item[2]}</small></span><strong>{item[3]}</strong></div>)}</div>
          </div>
        </div>
      </div>
      <div className="float-card fc-one"><span>AI AUTOMATION</span><b>14.2 hrs</b><small>saved this week</small></div>
      <div className="float-card fc-two"><i>✓</i><span><b>Workflow complete</b><small>Purchase order #2048</small></span></div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ================================================================
   TYPES
   ================================================================ */
interface GalleryProject {
  title: string;
  category: string;
  type: string;
  location: string;
  desc: string;
  emoji: string;
  beforeAfter?: boolean;
}
interface ToolItem { name: string; desc: string; emoji: string; }
interface FeedItem { title: string; source: string; url: string; }
interface ImpactMetric { value: string; label: string; }
interface TimelineEntry { year: string; role: string; desc: string; }
interface CertEntry { name: string; org: string; emoji: string; }
interface PartnerEntry { name: string; type: string; }
interface ArchLayer { num: string; title: string; desc: string; }
interface CityEntry { city: string; tz: string; }
interface ServiceCard { title: string; desc: string; emoji: string; }

/* ================================================================
   DATA
   ================================================================ */
const SERVICES: ServiceCard[] = [
  { title: "Hardwood Installation", desc: "Precision-fitted solid and engineered hardwood for new construction and renovation. Nail-down, glue-down, and floating installations with meticulous subfloor preparation.", emoji: "🪵" },
  { title: "Floor Refinishing", desc: "Complete sanding, staining, and finishing to restore worn hardwood to showroom condition. Custom stain matching and multi-coat polyurethane systems.", emoji: "✨" },
  { title: "Custom Staircase Work", desc: "Bespoke staircase renovation including treads, risers, stringers, and handrails. Seamless transitions from floor to stair with matched species and finish.", emoji: "🏗️" },
  { title: "Dust-Free Sanding", desc: "State-of-the-art Bona dust containment systems that capture 99.8% of airborne particles. Clean, healthy refinishing for occupied homes and commercial spaces.", emoji: "💨" },
  { title: "Custom Inlays & Borders", desc: "Handcrafted medallions, herringbone patterns, chevron designs, and decorative borders. Precision-cut from exotic and domestic hardwoods.", emoji: "🎨" },
  { title: "Repair & Restoration", desc: "Expert board replacement, water damage repair, gap filling, and structural reinforcement. Matching existing floors with invisible repairs.", emoji: "🔧" },
];

const ARCH_LAYERS: ArchLayer[] = [
  { num: "01", title: "Assessment & Preparation", desc: "Comprehensive moisture testing, subfloor evaluation, and acclimation protocols. Every project begins with a thorough site analysis to ensure long-term performance and dimensional stability." },
  { num: "02", title: "Material Selection & Design", desc: "Curated species selection from premium mills — white oak, walnut, maple, hickory, and exotic imports. Custom stain development and pattern design tailored to each client's vision." },
  { num: "03", title: "Precision Installation", desc: "Meticulous layout planning, laser-guided alignment, and hand-fitted transitions. Every board is inspected, every joint is tight, every detail is deliberate." },
  { num: "04", title: "Finishing & Protection", desc: "Multi-coat finishing systems using Bona and Loba professional-grade products. UV-cured, oil-modified, and water-based options for maximum durability and beauty." },
];

const GALLERY: GalleryProject[] = [
  { title: "Forest Hill Heritage Restoration", category: "Refinish", type: "Residential", location: "Toronto", desc: "Complete restoration of 1920s quarter-sawn white oak floors. Hand-scraped finish with custom walnut stain.", emoji: "🏠", beforeAfter: true },
  { title: "King West Penthouse Install", category: "Install", type: "Residential", location: "Toronto", desc: "2,400 sq ft engineered European oak in herringbone pattern. Floating installation over radiant heat.", emoji: "🏢" },
  { title: "Oakville Estate Staircase", category: "Stairs", type: "Residential", location: "Oakville", desc: "Custom walnut staircase with box newels, iron balusters, and hand-finished treads. 32 steps across three floors.", emoji: "🪜", beforeAfter: true },
  { title: "Yorkville Boutique Hotel Lobby", category: "Install", type: "Commercial", location: "Toronto", desc: "3,800 sq ft wide-plank hickory with custom medallion inlay at entrance. High-traffic commercial finish.", emoji: "🏨" },
  { title: "Mississauga Water Damage Repair", category: "Repair", type: "Residential", location: "Mississauga", desc: "Emergency board replacement and refinishing after flooding. Matched 15-year-old red oak with invisible seams.", emoji: "🔧", beforeAfter: true },
  { title: "Rosedale Custom Inlay Project", category: "Custom", type: "Residential", location: "Toronto", desc: "Hand-cut compass rose medallion in walnut, maple, and cherry. 48-inch diameter centerpiece in formal dining room.", emoji: "🎨" },
  { title: "Vaughan New Build — 4,200 sq ft", category: "Install", type: "Residential", location: "Vaughan", desc: "Full-home solid white oak installation with site-finished matte polyurethane. Seamless flow across all living spaces.", emoji: "🏡" },
  { title: "Richmond Hill Condo Refinish", category: "Refinish", type: "Residential", location: "Richmond Hill", desc: "Dust-free refinishing of 1,100 sq ft maple floors in occupied unit. Bona dust containment with same-day return.", emoji: "✨" },
  { title: "Etobicoke Restaurant Renovation", category: "Install", type: "Commercial", location: "Etobicoke", desc: "Reclaimed barn board feature wall and wide-plank ash flooring. Commercial-grade oil finish for high-traffic dining.", emoji: "🍽️" },
];

const TOOLS: ToolItem[] = [
  { name: "Bona FlexiSand", emoji: "🔴", desc: "Multi-disc sanding system for flawless finish preparation" },
  { name: "Lägler Hummel", emoji: "⚙️", desc: "Belt sander for aggressive stock removal on large areas" },
  { name: "Festool Planex", emoji: "🔵", desc: "Drywall and edge sanding with dust extraction" },
  { name: "Bona DCS", emoji: "💨", desc: "Dust containment system — 99.8% particle capture" },
  { name: "Primatech P250ALR", emoji: "🔨", desc: "Pneumatic nailer for solid hardwood installation" },
  { name: "Bona Traffic HD", emoji: "🛡️", desc: "Commercial-grade two-component waterborne finish" },
  { name: "Tramex MEP", emoji: "📊", desc: "Professional moisture encounter plus for subfloor testing" },
  { name: "Loba 2K Supra", emoji: "💎", desc: "Premium two-component oil-modified polyurethane" },
];

const IMPACT: ImpactMetric[] = [
  { value: "1,200+", label: "Floors Installed & Refinished" },
  { value: "15+", label: "Years of Master Craftsmanship" },
  { value: "<1%", label: "Callback Rate" },
  { value: "98%", label: "Client Satisfaction Score" },
];

const TIMELINE: TimelineEntry[] = [
  { year: "2022 — Present", role: "Founder & Master Craftsman — FG Hardwood Flooring", desc: "Leading a dedicated crew of specialists across the GTA. Managing end-to-end project delivery from consultation through final coat. Averaging 120+ projects per year with a focus on luxury residential and heritage restoration." },
  { year: "2017 — 2022", role: "Lead Installer — Premium Flooring Solutions", desc: "Managed installation teams for high-end residential and commercial projects across Toronto. Specialized in complex patterns including herringbone, chevron, and custom inlays. Trained 12 apprentices in precision installation techniques." },
  { year: "2013 — 2017", role: "Journeyman Floor Specialist — GTA Hardwood Co.", desc: "Developed expertise in dust-free sanding systems and water-based finishing. Completed NWFA certification and Bona Certified Craftsman training. Executed 400+ residential refinishing projects." },
  { year: "2009 — 2013", role: "Apprentice — Heritage Floor Restoration", desc: "Learned the craft from master European floor layers. Specialized in restoration of century homes and heritage properties. Developed hand-scraping and distressing techniques for period-authentic finishes." },
];

const CERTS: CertEntry[] = [
  { name: "NWFA Certified Installation Professional", org: "National Wood Flooring Association", emoji: "🏆" },
  { name: "Bona Certified Craftsman", org: "Bona AB — Sweden", emoji: "🔴" },
  { name: "Bona Dust Containment Certified", org: "Bona DCS Program", emoji: "💨" },
  { name: "Loba Certified Applicator", org: "Loba-Wakol — Germany", emoji: "💎" },
  { name: "WSIB Compliant", org: "Workplace Safety & Insurance Board", emoji: "🛡️" },
  { name: "Fully Licensed & Insured", org: "Ontario Business License", emoji: "📋" },
];

const PARTNERS: PartnerEntry[] = [
  { name: "Bona", type: "Finishing Systems" },
  { name: "Loba-Wakol", type: "Premium Coatings" },
  { name: "Lägler", type: "Sanding Equipment" },
  { name: "Primatech", type: "Installation Tools" },
  { name: "Festool", type: "Precision Tools" },
  { name: "Mirage Floors", type: "Engineered Hardwood" },
  { name: "Mercier Wood", type: "Premium Hardwood" },
  { name: "NWFA", type: "Industry Association" },
];

const CITIES: CityEntry[] = [
  { city: "Toronto", tz: "America/Toronto" },
  { city: "Mississauga", tz: "America/Toronto" },
  { city: "Oakville", tz: "America/Toronto" },
  { city: "Vaughan", tz: "America/Toronto" },
  { city: "Markham", tz: "America/Toronto" },
  { city: "Richmond Hill", tz: "America/Toronto" },
  { city: "Etobicoke", tz: "America/Toronto" },
  { city: "Brampton", tz: "America/Toronto" },
  { city: "Burlington", tz: "America/Toronto" },
  { city: "Scarborough", tz: "America/Toronto" },
];

const FALLBACK_FEED: FeedItem[] = [
  { title: "Hardwood Flooring Trends 2026: Wide Plank and Natural Finishes Dominate", source: "NWFA Magazine", url: "#" },
  { title: "Dust-Free Sanding Technology Reaches New Efficiency Standards", source: "Floor Covering Weekly", url: "#" },
  { title: "European Oak Demand Surges as Homeowners Seek Timeless Aesthetics", source: "Hardwood Floors Magazine", url: "#" },
  { title: "Bona Launches Next-Generation Traffic HD Finish System", source: "Bona News", url: "#" },
  { title: "GTA Housing Market Drives Record Renovation Spending", source: "CREA Market Watch", url: "#" },
];

/* ================================================================
   CANVAS VISUALIZERS
   ================================================================ */
type VizDraw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

const drawWoodGrainFlow: VizDraw = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const layers = 12;
  for (let i = 0; i < layers; i++) {
    const y = (h / layers) * i;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(212, 165, 116, ${0.15 + (i / layers) * 0.25})`;
    ctx.lineWidth = 1.5;
    for (let x = 0; x < w; x += 2) {
      const wave = Math.sin((x + t * 40) * 0.008 + i * 0.7) * 8 +
                   Math.sin((x + t * 25) * 0.015 + i * 1.2) * 4;
      const knot = Math.exp(-Math.pow((x - (w * 0.6 + i * 20)) / 30, 2)) * 15 * Math.sin(t * 0.5 + i);
      if (x === 0) ctx.moveTo(x, y + wave + knot);
      else ctx.lineTo(x, y + wave + knot);
    }
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(212, 165, 116, 0.4)";
  ctx.font = "10px Inter";
  ctx.fillText("WOOD GRAIN FLOW", 10, h - 10);
};

const drawSandingMap: VizDraw = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const gridSize = 20;
  const cols = Math.ceil(w / gridSize);
  const rows = Math.ceil(h / gridSize);
  const scanX = ((t * 60) % (w + 80)) - 40;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * gridSize;
      const y = r * gridSize;
      const dist = Math.abs(x - scanX);
      const sanded = dist < 40 ? 1 - dist / 40 : 0;
      const base = Math.sin(c * 0.3 + r * 0.5) * 0.3 + 0.3;
      const alpha = x < scanX - 40 ? 0.5 + base * 0.3 : base * 0.2 + sanded * 0.6;
      ctx.fillStyle = x < scanX - 40
        ? `rgba(212, 165, 116, ${alpha})`
        : `rgba(107, 99, 88, ${alpha})`;
      ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
    }
  }
  ctx.strokeStyle = "rgba(16, 185, 129, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(scanX, 0);
  ctx.lineTo(scanX, h);
  ctx.stroke();
  ctx.fillStyle = "rgba(16, 185, 129, 0.6)";
  ctx.font = "9px Inter";
  ctx.fillText(`GRIT: ${Math.floor(60 + (scanX / w) * 60)}`, scanX + 5, 15);
  ctx.fillStyle = "rgba(212, 165, 116, 0.4)";
  ctx.font = "10px Inter";
  ctx.fillText("SANDING PROGRESS MAP", 10, h - 10);
};

const drawInstallPulse: VizDraw = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const boards = 18;
  const bw = w / boards;
  for (let i = 0; i < boards; i++) {
    const phase = (t * 2 + i * 0.3) % (Math.PI * 2);
    const progress = Math.max(0, Math.sin(phase) * 0.5 + 0.5);
    const x = i * bw;
    ctx.fillStyle = `rgba(212, 165, 116, ${0.1 + progress * 0.4})`;
    ctx.fillRect(x + 1, h * (1 - progress), bw - 2, h * progress);
    ctx.strokeStyle = `rgba(212, 165, 116, ${0.3 + progress * 0.4})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 1, h * (1 - progress), bw - 2, h * progress);
  }
  const lineY = h * 0.3;
  ctx.beginPath();
  ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
  ctx.lineWidth = 1.5;
  for (let x = 0; x < w; x += 2) {
    const y = lineY + Math.sin((x + t * 80) * 0.02) * 15 + Math.sin((x + t * 50) * 0.05) * 5;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "rgba(212, 165, 116, 0.4)";
  ctx.font = "10px Inter";
  ctx.fillText("INSTALLATION PULSE", 10, h - 10);
};

const drawStainDiffuser: VizDraw = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.5;
  for (let ring = 0; ring < 8; ring++) {
    const radius = 20 + ring * 25 + Math.sin(t * 0.8 + ring) * 10;
    const alpha = 0.3 - ring * 0.03;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(212, 165, 116, ${Math.max(0.05, alpha)})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  const particles = 40;
  for (let i = 0; i < particles; i++) {
    const angle = (i / particles) * Math.PI * 2 + t * 0.3;
    const dist = 30 + Math.sin(t * 0.5 + i * 0.8) * 60 + i * 2;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;
    const size = 2 + Math.sin(t + i) * 1;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 165, 116, ${0.3 + Math.sin(t + i) * 0.2})`;
    ctx.fill();
  }
  ctx.fillStyle = "rgba(212, 165, 116, 0.4)";
  ctx.font = "10px Inter";
  ctx.fillText("STAIN DIFFUSION", 10, h - 10);
};

const drawAlignmentGrid: VizDraw = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const spacing = 30;
  ctx.strokeStyle = "rgba(212, 165, 116, 0.08)";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < w; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  const boards = 6;
  const bh = 12;
  const gap = 2;
  for (let row = 0; row < Math.ceil(h / (bh + gap)); row++) {
    const offset = (row % 2 === 0 ? 0 : 0.5) * (w / boards);
    const animOffset = Math.sin(t * 0.3 + row * 0.2) * 3;
    for (let col = -1; col <= boards; col++) {
      const x = col * (w / boards) + offset + animOffset;
      const y = row * (bh + gap);
      ctx.fillStyle = `rgba(212, 165, 116, ${0.12 + Math.sin(t * 0.5 + row * 0.3 + col * 0.2) * 0.08})`;
      ctx.fillRect(x + 1, y, (w / boards) - 2, bh);
    }
  }
  const laserY = (h * 0.5) + Math.sin(t * 0.4) * 20;
  ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(0, laserY); ctx.lineTo(w, laserY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(212, 165, 116, 0.4)";
  ctx.font = "10px Inter";
  ctx.fillText("ALIGNMENT GRID", 10, h - 10);
};

const drawCuringMonitor: VizDraw = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const channels = 4;
  const labels = ["COAT 1", "COAT 2", "COAT 3", "TOPCOAT"];
  const colors = ["rgba(212, 165, 116, 0.6)", "rgba(232, 201, 160, 0.6)", "rgba(16, 185, 129, 0.6)", "rgba(245, 230, 211, 0.6)"];
  const chH = h / channels;
  for (let ch = 0; ch < channels; ch++) {
    const baseY = ch * chH + chH * 0.5;
    ctx.beginPath();
    ctx.strokeStyle = colors[ch];
    ctx.lineWidth = 1.5;
    for (let x = 0; x < w; x += 2) {
      const progress = x / w;
      const cured = 1 / (1 + Math.exp(-10 * (progress - 0.3 - ch * 0.15 + Math.sin(t * 0.2) * 0.05)));
      const y = baseY - cured * (chH * 0.35) + Math.sin((x + t * 30) * 0.03) * 3 * (1 - cured);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = colors[ch];
    ctx.font = "8px Inter";
    ctx.fillText(labels[ch], 8, ch * chH + 14);
  }
  ctx.strokeStyle = "rgba(212, 165, 116, 0.15)";
  ctx.lineWidth = 0.5;
  for (let ch = 1; ch < channels; ch++) {
    ctx.beginPath(); ctx.moveTo(0, ch * chH); ctx.lineTo(w, ch * chH); ctx.stroke();
  }
  ctx.fillStyle = "rgba(212, 165, 116, 0.4)";
  ctx.font = "10px Inter";
  ctx.fillText("CURING MONITOR", 10, h - 10);
};

const drawInlayDesigner: VizDraw = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.5;
  const size = Math.min(w, h) * 0.35;
  const points = 8;
  for (let ring = 0; ring < 3; ring++) {
    const r = size * (0.4 + ring * 0.3);
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2 + t * 0.2 * (ring % 2 === 0 ? 1 : -1);
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(212, 165, 116, ${0.3 - ring * 0.08})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2 + t * 0.2;
    const inner = size * 0.4;
    const outer = size * 1.0;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
    ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
    ctx.strokeStyle = "rgba(212, 165, 116, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();
    const dotR = 3 + Math.sin(t * 2 + i) * 1;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer, dotR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 165, 116, ${0.4 + Math.sin(t + i) * 0.2})`;
    ctx.fill();
  }
  const cursorAngle = t * 0.5;
  const cursorR = size * 0.7 + Math.sin(t) * 15;
  const cursorX = cx + Math.cos(cursorAngle) * cursorR;
  const cursorY = cy + Math.sin(cursorAngle) * cursorR;
  ctx.beginPath();
  ctx.arc(cursorX, cursorY, 5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(16, 185, 129, 0.7)";
  ctx.fill();
  ctx.fillStyle = "rgba(212, 165, 116, 0.4)";
  ctx.font = "10px Inter";
  ctx.fillText("INLAY DESIGNER", 10, h - 10);
};

const VISUALIZERS: { name: string; draw: VizDraw }[] = [
  { name: "Wood Grain Flow", draw: drawWoodGrainFlow },
  { name: "Sanding Progress Map", draw: drawSandingMap },
  { name: "Installation Pulse", draw: drawInstallPulse },
  { name: "Stain Diffusion", draw: drawStainDiffuser },
  { name: "Alignment Grid", draw: drawAlignmentGrid },
  { name: "Curing Monitor", draw: drawCuringMonitor },
  { name: "Inlay Designer", draw: drawInlayDesigner },
];

/* ================================================================
   HOOKS
   ================================================================ */
function useClocks(cities: CityEntry[]) {
  const [times, setTimes] = useState<string[]>(cities.map(() => "--:--"));
  useEffect(() => {
    const tick = () =>
      setTimes(
        cities.map((c) => {
          try {
            return new Date().toLocaleTimeString("en-US", {
              timeZone: c.tz, hour: "2-digit", minute: "2-digit", hour12: false,
            });
          } catch { return "--:--"; }
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [cities]);
  return times;
}

function useVisualizer(canvasRef: React.RefObject<HTMLCanvasElement | null>, draw: VizDraw) {
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let start: number | null = null;
    const loop = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      const dpr = window.devicePixelRatio || 1;
      const rect = cvs.getBoundingClientRect();
      cvs.width = rect.width * dpr;
      cvs.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      draw(ctx, rect.width, rect.height, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [canvasRef, draw]);
}

/* ================================================================
   COMPONENTS
   ================================================================ */
function VisualizerRotator() {
  const [idx, setIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % VISUALIZERS.length), 10000);
    return () => clearInterval(id);
  }, []);
  useVisualizer(canvasRef, VISUALIZERS[idx].draw);
  return (
    <div className="visualizer-shell" style={{ position: "relative" }}>
      <canvas ref={canvasRef} />
      <span className="viz-label">{VISUALIZERS[idx].name}</span>
    </div>
  );
}

function CostCalculator() {
  const [sqft, setSqft] = useState(500);
  const [service, setService] = useState("install");
  const rates: Record<string, number[]> = {
    install: [8, 14],
    refinish: [4, 8],
    stairs: [120, 250],
    repair: [6, 12],
  };
  const isStairs = service === "stairs";
  const r = rates[service];
  const low = isStairs ? r[0] * Math.ceil(sqft / 50) : r[0] * sqft;
  const high = isStairs ? r[1] * Math.ceil(sqft / 50) : r[1] * sqft;
  return (
    <div className="calculator glass-panel">
      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
        Quick Cost Estimator
      </h3>
      <div className="calc-field">
        <label>{isStairs ? "Number of Steps" : "Square Footage"}</label>
        <input
          type="number"
          value={sqft}
          onChange={(e) => setSqft(Math.max(1, parseInt(e.target.value) || 0))}
          min={1}
        />
      </div>
      <div className="calc-field">
        <label>Service Type</label>
        <select value={service} onChange={(e) => setService(e.target.value)}>
          <option value="install">Hardwood Installation</option>
          <option value="refinish">Refinishing</option>
          <option value="stairs">Staircase Work</option>
          <option value="repair">Repair</option>
        </select>
      </div>
      <div className="calc-result">
        <div className="price">${low.toLocaleString()} — ${high.toLocaleString()}</div>
        <div className="note">Estimated range &middot; Final quote after on-site assessment</div>
      </div>
    </div>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function Home() {
  const times = useClocks(CITIES);
  const [feeds, setFeeds] = useState<FeedItem[]>(FALLBACK_FEED);
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Install", "Refinish", "Stairs", "Repair", "Custom"];
  const typeFilters = ["All", "Residential", "Commercial"];
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = GALLERY.filter((p) => {
    const catMatch = filter === "All" || p.category === filter;
    const typeMatch = typeFilter === "All" || p.type === typeFilter;
    return catMatch && typeMatch;
  });

  /* RSS feed */
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.floorcoveringweekly.com%2Ffeed",
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.items?.length) {
          setFeeds(
            data.items.slice(0, 5).map((item: { title: string; link: string }) => ({
              title: item.title,
              source: "Floor Covering Weekly",
              url: item.link,
            }))
          );
        }
      } catch { /* fallback */ }
    })();
    return () => controller.abort();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your inquiry! Franco will respond within 24 hours.");
  }, []);

  return (
    <>
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="hero" id="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">Master Hardwood Craftsman &middot; Toronto &amp; GTA</div>
            <h1 className="hero-title">Heritage Hardwood. Modern Precision.</h1>
            <p className="hero-subtitle">
              I transform spaces through the timeless art of hardwood flooring. From century-home
              restorations to contemporary custom installations, every board I lay carries fifteen
              years of dedication to perfection.
            </p>
            <div className="hero-ctas">
              <a href="#portfolio" className="cta-primary">View Portfolio</a>
              <a href="#contact" className="cta-secondary">Free Quote</a>
              <a href="https://www.instagram.com/francogiacinto/" target="_blank" rel="noopener noreferrer" className="cta-secondary">Instagram</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="portrait-shell">
              <img src="/portrait.jpg" alt="Franco Giacinto Oller Grimaldi" width={800} height={1000} />
            </div>
            <VisualizerRotator />
          </div>
        </div>
      </section>

      {/* ── GLOBAL ORIENTATION ────────────────────────── */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...CITIES, ...CITIES].map((c, i) => (
            <div key={i} className="marquee-item">
              <span className="city">{c.city}</span>
              <span className="clock">{times[i % CITIES.length]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT / SERVICES ──────────────────────────── */}
      <section className="section" id="about">
        <div className="section-inner">
          <span className="section-label">Services</span>
          <h2 className="section-title">Craftsmanship That Speaks for Itself</h2>
          <p className="section-subtitle">
            Every floor tells a story. I bring fifteen years of hands-on expertise, premium materials,
            and an uncompromising eye for detail to every project — from a single room refinish to a
            full estate installation.
          </p>
          <div className="card-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="glass-panel">
                <div className="card-icon">{s.emoji}</div>
                <h3 className="card-title">{s.title}</h3>
                <p className="card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE OF CRAFTSMANSHIP ─────────────── */}
      <section className="section" id="architecture" style={{ background: "var(--bg-secondary)" }}>
        <div className="section-inner">
          <span className="section-label">Process</span>
          <h2 className="section-title">Architecture of Craftsmanship</h2>
          <p className="section-subtitle">
            Every project follows a disciplined four-phase methodology that ensures structural
            integrity, aesthetic excellence, and lasting performance.
          </p>
          <div className="arch-layers">
            {ARCH_LAYERS.map((l) => (
              <div key={l.num} className="arch-layer glass-panel">
                <div className="layer-num">{l.num}</div>
                <div>
                  <h3 className="layer-title">{l.title}</h3>
                  <p className="layer-desc">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO GALLERY ─────────────────────────── */}
      <section className="section" id="portfolio">
        <div className="section-inner">
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A selection of completed installations, refinishing projects, and custom work across the
            Greater Toronto Area. Each project reflects my commitment to precision and beauty.
          </p>
          <div className="gallery-filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`filter-btn${filter === c ? " active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
            <span style={{ width: "1px", background: "var(--border-glass)", margin: "0 0.5rem" }} />
            {typeFilters.map((tf) => (
              <button
                key={tf}
                className={`filter-btn${typeFilter === tf ? " active" : ""}`}
                onClick={() => setTypeFilter(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="gallery-grid">
            {filtered.map((p) => (
              <div key={p.title} className="gallery-item">
                <div className="gallery-thumb">
                  <span>{p.emoji}</span>
                  {p.beforeAfter && <span className="before-after">Before &amp; After</span>}
                </div>
                <div className="gallery-info">
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                  <div className="gallery-tags">
                    <span className="gallery-tag">{p.category}</span>
                    <span className="gallery-tag">{p.type}</span>
                    <span className="gallery-tag">{p.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS SHOWCASE ────────────────────────────── */}
      <section className="section" id="tools" style={{ background: "var(--bg-secondary)" }}>
        <div className="section-inner">
          <span className="section-label">Equipment</span>
          <h2 className="section-title">Professional-Grade Tools</h2>
          <p className="section-subtitle">
            I invest in the best equipment in the industry. Every tool is maintained to manufacturer
            specifications and calibrated for precision performance.
          </p>
          <div className="tools-grid">
            {TOOLS.map((t) => (
              <div key={t.name} className="glass-panel tool-card">
                <div className="tool-icon">{t.emoji}</div>
                <div className="tool-name">{t.name}</div>
                <div className="tool-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE INTELLIGENCE HUB ─────────────────────── */}
      <section className="section" id="live-intelligence">
        <div className="section-inner">
          <span className="section-label">Live Intelligence</span>
          <h2 className="section-title">Industry Pulse</h2>
          <p className="section-subtitle">
            Staying current with flooring technology, material innovations, and market trends to
            deliver the most informed recommendations to every client.
          </p>
          <div className="live-grid">
            {/* RSS Headlines */}
            <div className="glass-panel live-panel">
              <div className="live-panel-header">
                <span className="live-dot" />
                <h3>Industry Headlines</h3>
              </div>
              {feeds.map((f, i) => (
                <div key={i} className="feed-item">
                  <a href={f.url} target="_blank" rel="noopener noreferrer">{f.title}</a>
                  <div className="feed-source">{f.source}</div>
                </div>
              ))}
            </div>

            {/* Cost Calculator */}
            <CostCalculator />

            {/* Instagram Feed Placeholder */}
            <div className="glass-panel live-panel">
              <div className="live-panel-header">
                <span className="live-dot" />
                <h3>Latest Work — @francogiacinto</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {["🪵 White Oak Install", "✨ Refinish Complete", "🪜 Staircase Build", "🎨 Custom Inlay"].map((item, i) => (
                  <div key={i} style={{
                    aspectRatio: "1", background: "var(--bg-tertiary)", borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", padding: "0.5rem",
                    border: "1px solid var(--border-glass)",
                  }}>
                    {item}
                  </div>
                ))}
              </div>
              <a
                href="https://www.instagram.com/francogiacinto/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", textAlign: "center", marginTop: "1rem",
                  color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
                }}
              >
                Follow on Instagram &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT DASHBOARD ──────────────────────────── */}
      <section className="section" id="impact" style={{ background: "var(--bg-secondary)" }}>
        <div className="section-inner">
          <span className="section-label">Impact</span>
          <h2 className="section-title">Quantified Craftsmanship</h2>
          <div className="impact-grid">
            {IMPACT.map((m) => (
              <div key={m.label} className="glass-panel impact-card">
                <div className="impact-value">{m.value}</div>
                <div className="impact-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ────────────────────────────────── */}
      <section className="section" id="experience">
        <div className="section-inner">
          <span className="section-label">Experience</span>
          <h2 className="section-title">Fifteen Years on the Tools</h2>
          <p className="section-subtitle">
            From apprentice to master craftsman — a career built board by board, finish by finish,
            with an unwavering commitment to the craft.
          </p>
          <div className="timeline">
            {TIMELINE.map((t) => (
              <div key={t.year} className="timeline-item">
                <div className="timeline-year">{t.year}</div>
                <div className="timeline-role">{t.role}</div>
                <div className="timeline-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ────────────────────────────── */}
      <section className="section" id="certifications" style={{ background: "var(--bg-secondary)" }}>
        <div className="section-inner">
          <span className="section-label">Certifications</span>
          <h2 className="section-title">Industry Standards</h2>
          <p className="section-subtitle">
            Certified by the leading organizations in the hardwood flooring industry. Every
            credential represents hours of training and a commitment to excellence.
          </p>
          <div className="cert-grid">
            {CERTS.map((c) => (
              <div key={c.name} className="glass-panel cert-card">
                <div className="cert-icon">{c.emoji}</div>
                <div>
                  <div className="cert-name">{c.name}</div>
                  <div className="cert-org">{c.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ──────────────────────────────────── */}
      <section className="section" id="partners">
        <div className="section-inner">
          <span className="section-label">Partners</span>
          <h2 className="section-title">Trusted Ecosystem</h2>
          <p className="section-subtitle">
            I work exclusively with the finest manufacturers and suppliers in the industry. These
            partnerships ensure access to premium materials and the latest finishing technologies.
          </p>
          <div className="partners-grid">
            {PARTNERS.map((p) => (
              <div key={p.name} className="glass-panel partner-card">
                <div className="partner-name">{p.name}</div>
                <div className="partner-type">{p.type}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────── */}
      <section className="section" id="contact" style={{ background: "var(--bg-secondary)" }}>
        <div className="section-inner">
          <span className="section-label">Contact</span>
          <h2 className="section-title">Start Your Project</h2>
          <p className="section-subtitle">
            Ready to transform your space? Reach out for a free on-site consultation and detailed
            quote. I personally assess every project to ensure the perfect approach.
          </p>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">
                    <a href="mailto:franco@fghardwood.ca">franco@fghardwood.ca</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">
                    <a href="tel:+14165550199">+1 (416) 555-0199</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📸</div>
                <div>
                  <div className="contact-label">Instagram</div>
                  <div className="contact-value">
                    <a href="https://www.instagram.com/francogiacinto/" target="_blank" rel="noopener noreferrer">@francogiacinto</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-label">Service Area</div>
                  <div className="contact-value">Greater Toronto Area, Ontario</div>
                </div>
              </div>
            </div>
            <form className="glass-panel contact-form" onSubmit={handleSubmit}>
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email Address" required />
              <input type="tel" placeholder="Phone Number" />
              <select>
                <option value="">Select Service</option>
                <option value="install">Hardwood Installation</option>
                <option value="refinish">Refinishing</option>
                <option value="stairs">Staircase Work</option>
                <option value="repair">Repair</option>
                <option value="custom">Custom Inlays</option>
                <option value="other">Other</option>
              </select>
              <textarea placeholder="Tell me about your project..." rows={4} />
              <button type="submit">Request Free Quote</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

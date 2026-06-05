import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Staggered reveal hook ─── */
function useReveal(delay = 0) {
    const ref = useRef();
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); io.disconnect(); }
        }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);
    return [ref, visible];
}

const FEATURES = [
    {
        tag: "Canvas",
        headline: "Build visually,\nship instantly",
        body: "Drag, connect, and configure nodes on an infinite canvas. No YAML, no Dockerfiles — just logic.",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0"/></svg>`,
    },
    {
        tag: "API",
        headline: "GraphQL out\nof the box",
        body: "Every workflow becomes a typed, real-time GraphQL endpoint the moment you hit deploy.",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2l9 4.9V17L12 22l-9-5.1V6.9z"/><path d="M12 22V12M3 7l9 5 9-5"/></svg>`,
    },
    {
        tag: "Integrations",
        headline: "200+ services,\none click auth",
        body: "Slack, Stripe, GitHub, Notion, AWS — OAuth tokens, retries, and rate-limits handled for you.",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
    },
    {
        tag: "Observability",
        headline: "Watch every\nbyte in flight",
        body: "Live run history, payload inspector, node-level replay. Debug in seconds, not hours.",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`,
    },
];

const STEPS = [
    { label: "Design", detail: "Drop nodes, draw edges, add conditions and branches on an infinite canvas.", hint: "No code required" },
    { label: "Connect", detail: "Authenticate with any service in under 30 seconds — ORG handles tokens automatically.", hint: "One-click OAuth" },
    { label: "Deploy", detail: "One click. Your workflow is live with a webhook URL, cron schedule, and GraphQL endpoint.", hint: "Instant deployment" },
    { label: "Monitor", detail: "Inspect every execution live. Replay failures, alert on anomalies, never fly blind.", hint: "Real-time visibility" },
];

const LOGOS = ["Webhook Triggers", "AI Node Generation", "Docker Deployments", "Custom Logic Nodes", "Team Collaboration"];

/* ─── Connector arrow between nodes ─── */
const Connector = () => (
    <div style={{ width: 36, flexShrink: 0, position: "relative", display: "flex", alignItems: "center" }}>
        <div style={{
            width: "100%",
            height: 1.5,
            background: "repeating-linear-gradient(90deg, #10b981 0, #10b981 4px, transparent 4px, transparent 8px)",
        }} />
        <div style={{
            position: "absolute",
            right: 0,
            width: 0,
            height: 0,
            borderTop: "4px solid transparent",
            borderBottom: "4px solid transparent",
            borderLeft: "5px solid #10b981",
        }} />
    </div>
);

/* ─── Mock Canvas ─── */
const MockCanvas = () => (
    <div style={MC.shell}>
        {/* Topbar */}
        <div style={MC.topbar}>
            <div style={MC.tbLeft}>
                <span style={{ color: "#666", fontSize: 12, cursor: "pointer" }}>←</span>
                <div>
                    <div style={{ color: "#fff", fontSize: 11, fontWeight: 600, fontFamily: "monospace" }}>
                        Workflow 030ddc
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#888", fontSize: 9, marginTop: 1 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                        Draft Saved · Last run 2m ago
                    </div>
                </div>
            </div>
            <div style={MC.tbRight}>
                {["💾 Save", "🔗 Share", "⏱ History"].map(a => (
                    <span key={a} style={MC.tbAction}>{a}</span>
                ))}
                <span style={MC.tbDeploy}>🚀 Deploy</span>
                <span style={MC.tbRun}>▶ Run</span>
            </div>
        </div>

        {/* Body */}
        <div style={MC.body}>
            {/* Sidebar */}
            <div style={MC.sidebar}>
                <div style={MC.sbHead}>
                    <span>📦 NODES</span>
                    <span style={{ color: "#444" }}>&lt;</span>
                </div>

                <div style={MC.sbSection}>⚡ Triggers</div>
                <div style={MC.sbItem}><span style={{ color: "#f59e0b" }}>⚡</span> Webhook</div>

                <div style={{ ...MC.sbSection, color: "#60a5fa" }}>⚙ Actions</div>
                <div style={MC.sbItem}><span>🌐</span> HTTP Request</div>
                <div style={MC.sbItem}><span>✉️</span> Send Email</div>
                <div style={MC.sbItem}><span style={{ color: "#10b981" }}>🤖</span> AI</div>

                <div style={{ ...MC.sbSection, color: "#f472b6" }}>🔀 Logic</div>
                <div style={MC.sbItem}><span style={{ color: "#f472b6" }}>⑃</span> Condition</div>
                <div style={MC.sbItem}><span style={{ color: "#10b981" }}>⏱</span> Delay</div>
            </div>

            {/* Canvas Area */}
            <div style={MC.canvasArea}>
                {/* Nodes Row */}
                <div style={MC.nodesRow}>
                    {/* Webhook Node */}
                    <div style={MC.node}>
                        <div style={MC.nodeDot} />
                        <div style={MC.nodeHeader}>
                            <span style={{ fontSize: 11, color: "#f59e0b" }}>⚡</span>
                            <span style={MC.nodeTitle}>Webhook Trigger</span>
                        </div>
                        <div style={MC.fieldLabel}>Endpoint URL</div>
                        <div style={MC.fieldVal}>https://org.../webhook</div>
                        <div style={MC.nodeFooter}>
                            <span style={MC.footLabel}>Status:</span>
                            <span style={MC.footOk}>● Success</span>
                        </div>
                    </div>

                    <Connector />

                    {/* AI Node */}
                    <div style={MC.node}>
                        <div style={MC.nodeDot} />
                        <div style={MC.nodeHeader}>
                            <span style={{ fontSize: 11, color: "#10b981" }}>🤖</span>
                            <span style={MC.nodeTitle}>AI</span>
                        </div>
                        <div style={MC.kvBox}>
                            <div style={MC.kvRow}>
                                <span style={MC.kvKey}>Model:</span>
                                <span style={MC.kvVal}>gemini-2.5-flash</span>
                            </div>
                            <div style={MC.kvRow}>
                                <span style={MC.kvKey}>Prompt:</span>
                                <span style={{ ...MC.kvVal, color: "#555" }}>You are a GitHub event...</span>
                            </div>
                        </div>
                        <div style={MC.nodeFooter}>
                            <span style={MC.footLabel}>Status:</span>
                            <span style={MC.footOk}>● Success</span>
                        </div>
                    </div>

                    <Connector />

                    {/* Email Node */}
                    <div style={MC.node}>
                        <div style={MC.nodeDot} />
                        <div style={MC.nodeHeader}>
                            <span style={{ fontSize: 11, color: "#888" }}>✉️</span>
                            <span style={MC.nodeTitle}>Send Email</span>
                        </div>
                        <div style={MC.kvBox}>
                            <div style={MC.kvRow}>
                                <span style={MC.kvKey}>To:</span>
                                <span style={MC.kvVal}>user@example.com</span>
                            </div>
                            <div style={MC.kvRow}>
                                <span style={MC.kvKey}>Sub:</span>
                                <span style={{ ...MC.kvVal, color: "#555" }}>GitHub Push...</span>
                            </div>
                        </div>
                        <div style={MC.nodeFooter}>
                            <span style={MC.footLabel}>Status:</span>
                            <span style={MC.footOk}>● Success</span>
                        </div>
                    </div>
                </div>

                {/* Live Logs */}
                <div style={MC.logsBar}>
                    <div style={MC.logsHead}>
                        <span>&gt;_ LIVE EXECUTION LOGS</span>
                        <span style={{ color: "#333" }}>_ □ ✕</span>
                    </div>
                    {[
                        { color: "#f59e0b", text: "[7:11:24 PM] Workflow execution started..." },
                        { color: "#10b981", text: "[7:12:00 PM] webhookTrigger — success" },
                        { color: "#10b981", text: "[7:12:00 PM] aiNode — success" },
                        { color: "#10b981", text: "[7:12:00 PM] emailNode — success" },
                    ].map((l, i) => (
                        <div key={i} style={{ fontFamily: "monospace", fontSize: 8, lineHeight: 1.7, color: l.color }}>
                            {l.text}
                        </div>
                    ))}
                </div>

                {/* Minimap */}
                <div style={MC.minimap}>
                    <div style={{ position: "relative", width: 64, height: 40 }}>
                        <div style={{ position: "absolute", top: 19, left: 10, width: 44, height: 1, background: "#10b981", opacity: 0.6 }} />
                        {[
                            { left: 4, bg: "#f59e0b" },
                            { left: 25, bg: "#10b981" },
                            { left: 46, bg: "#60a5fa" },
                        ].map((m, i) => (
                            <div key={i} style={{
                                position: "absolute", top: 14, left: m.left,
                                width: 14, height: 9, background: m.bg,
                                opacity: 0.7, borderRadius: 2,
                            }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/* ─── MockCanvas Styles ─── */
const MC = {
    shell: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "'Inter', 'SF Pro Display', sans-serif",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 16px 48px -8px rgba(0,0,0,0.08)",
    },
    topbar: {
        background: "#18181b",
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        gap: 8,
    },
    tbLeft: { display: "flex", alignItems: "center", gap: 10 },
    tbRight: { display: "flex", alignItems: "center", gap: 6 },
    tbAction: {
        color: "#888", fontSize: 9, padding: "3px 7px",
        border: "0.5px solid #333", borderRadius: 4, cursor: "pointer",
    },
    tbDeploy: {
        color: "#ccc", fontSize: 9, padding: "3px 8px",
        border: "0.5px solid #444", borderRadius: 4, cursor: "pointer", background: "#2a2a2e",
    },
    tbRun: {
        color: "#fff", fontSize: 9, padding: "3px 8px",
        border: "none", borderRadius: 4, cursor: "pointer",
        background: "#10b981", fontWeight: 600,
    },
    body: { display: "flex", height: 300 },
    sidebar: {
        width: 130,
        background: "#18181b",
        borderRight: "0.5px solid #2a2a2e",
        padding: "10px 8px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflow: "hidden",
        flexShrink: 0,
    },
    sbHead: {
        color: "#555", fontSize: 8, fontWeight: 700, letterSpacing: ".06em",
        padding: "4px 4px 6px", display: "flex", justifyContent: "space-between",
    },
    sbSection: {
        color: "#f59e0b", fontSize: 7.5, fontWeight: 700,
        letterSpacing: ".07em", padding: "6px 4px 3px", textTransform: "uppercase",
    },
    sbItem: {
        padding: "5px 7px", background: "#222228", borderRadius: 4,
        color: "#d4d4d8", fontSize: 8.5,
        display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
    },
    canvasArea: {
        flex: 1,
        background: "#f4f4f5",
        backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        position: "relative",
        overflow: "hidden",
    },
    nodesRow: {
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        transform: "translateY(-60%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 20px",
    },
    node: {
        background: "#18181b",
        border: "1px solid #10b981",
        borderRadius: 7,
        padding: "10px 11px",
        width: 148,
        flexShrink: 0,
        position: "relative",
        boxShadow: "0 0 0 2px rgba(16,185,129,.15)",
    },
    nodeDot: {
        position: "absolute", top: 7, right: 7,
        width: 5, height: 5, borderRadius: "50%", background: "#10b981",
    },
    nodeHeader: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 },
    nodeTitle: { color: "#fff", fontSize: 10, fontWeight: 600 },
    fieldLabel: {
        color: "#555", fontSize: 7.5, textTransform: "uppercase",
        letterSpacing: ".05em", marginBottom: 3,
    },
    fieldVal: {
        background: "#0e0e11", borderRadius: 3, padding: "4px 6px",
        color: "#a1a1aa", fontSize: 8, fontFamily: "monospace",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    },
    kvBox: {
        display: "flex", flexDirection: "column", gap: 2,
        background: "#0e0e11", borderRadius: 3, padding: "5px 6px",
    },
    kvRow: { display: "flex", gap: 4, fontSize: 8, fontFamily: "monospace" },
    kvKey: { color: "#555", minWidth: 36 },
    kvVal: { color: "#a1a1aa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    nodeFooter: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginTop: 7, fontSize: 8,
    },
    footLabel: { color: "#555" },
    footOk: { color: "#10b981" },
    logsBar: {
        position: "absolute",
        bottom: 10, left: 10, right: 106,
        background: "#0e0e11",
        border: "0.5px solid #2a2a2e",
        borderRadius: 6,
        padding: "8px 10px",
    },
    logsHead: {
        color: "#555", fontSize: 8, fontWeight: 700, letterSpacing: ".05em",
        marginBottom: 5, display: "flex", justifyContent: "space-between",
    },
    minimap: {
        position: "absolute",
        bottom: 10, right: 10,
        width: 86, height: 64,
        background: "#18181b",
        border: "0.5px solid #2a2a2e",
        borderRadius: 6,
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
};

/* ─── Hero Page ─── */
export default function Hero() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    const goApp = () => {
        const token = localStorage.getItem("token");
        navigate(token ? "/dashboard" : "/login");
    };

    return (
        <div style={S.root} className="hero-page">
            <style>{CSS}</style>

            {/* ── HERO ── */}
            <section style={S.heroSection}>
                <div style={S.gridBg} aria-hidden />

                <div style={{
                    ...S.heroContent,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "none" : "translateY(20px)",
                    transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
                }}>
                    {/* Badge */}
                    <div style={S.badge}>
                        <span style={S.badgeDot} className="pulse-dot" />
                        <span>Beta Release — Actively in Development</span>
                        <span style={S.badgeArrow}>→</span>
                    </div>

                    {/* Headline */}
                    <h1 style={S.h1}>
                        Automate anything.<br />
                        <span style={S.h1Muted}>Ship faster.</span>
                    </h1>

                    <p style={S.subline}>
                        The visual workflow platform built for engineering teams.
                        Design on a canvas, deploy in one click, monitor in real time —
                        all through a <strong style={{ color: "#111", fontWeight: 600 }}>GraphQL-first API</strong>.
                    </p>

                    {/* CTAs */}
                    <div style={S.ctaRow}>
                        <button className="h-cta-primary" onClick={goApp}>
                            Create your first workflow
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 8 }}>
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="h-btn-ghost" style={{ padding: "12px 22px", fontSize: 14 }} onClick={() => navigate("/dashboard")}>
                            View live demo
                        </button>
                    </div>
                </div>

                {/* Canvas preview card */}
                <div style={{
                    ...S.terminalWrap,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "none" : "translateY(24px)",
                    transition: "opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s",
                }}>
                    <MockCanvas />
                </div>
            </section>

            {/* ── STATS ── */}
            <div style={S.statsWrap}>
                <div style={{
                    ...S.statsStrip,
                    opacity: mounted ? 1 : 0,
                    transition: "opacity 0.6s ease 0.3s",
                }}>
                    {[
                        { val: "Visual Editor", label: "No-code canvas" },
                        { val: "Real-time", label: "Live execution logs" },
                        { val: "API-First", label: "GraphQL ready" },
                        { val: "Scalable", label: "Built for speed" },
                    ].map((s) => (
                        <div key={s.label} style={S.statItem} className="h-stat">
                            <div style={{ ...S.statNum, fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}>
                                {s.val}
                            </div>
                            <div style={S.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FEATURES ── */}
            <section id="features" style={S.section}>
                <div style={S.sectionLabel}>Features</div>
                <h2 style={S.sectionH2}>Everything you need to<br />automate at any scale</h2>
                <p style={S.sectionSub}>Four pillars that make ORG the last automation tool you'll ever need.</p>

                <div style={S.featGrid}>
                    {FEATURES.map((f, i) => (
                        <div
                            key={f.tag}
                            style={{ ...S.featCard, animationDelay: `${i * 80}ms` }}
                            className="h-feat-card reveal-card"
                        >
                            <div style={S.featIconWrap} dangerouslySetInnerHTML={{ __html: f.icon }} />
                            <div style={S.featTag}>{f.tag}</div>
                            <h3 style={S.featHead}>
                                {f.headline.split("\n").map((l, j) => (
                                    <span key={j}>{l}{j === 0 && <br />}</span>
                                ))}
                            </h3>
                            <p style={S.featBody}>{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" style={{ ...S.section, ...S.howSection }}>
                <div style={S.sectionLabel}>How it works</div>
                <h2 style={S.sectionH2}>From idea to production<br />in four steps</h2>

                <div style={S.howGrid}>
                    <div style={S.stepList}>
                        {STEPS.map((s, i) => (
                            <button
                                key={s.label}
                                className={`h-step-btn${activeStep === i ? " h-step-active" : ""}`}
                                onClick={() => setActiveStep(i)}
                            >
                                <div style={S.stepLeft}>
                                    <span style={S.stepNum}>0{i + 1}</span>
                                    <span style={S.stepLabel}>{s.label}</span>
                                </div>
                                <span style={S.stepHint} className="step-hint">{s.hint}</span>
                            </button>
                        ))}
                    </div>

                    <div style={S.stepDetail}>
                        <div className="h-step-inner" key={activeStep}>
                            <div style={S.stepBigNum}>0{activeStep + 1}</div>
                            <h3 style={S.stepDetailHead}>{STEPS[activeStep].label}</h3>
                            <p style={S.stepDetailBody}>{STEPS[activeStep].detail}</p>
                            <div style={S.stepHintPill}>{STEPS[activeStep].hint}</div>
                            <button className="h-cta-primary" style={{ marginTop: 28, fontSize: 13 }} onClick={goApp}>
                                Try it free →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ROADMAP ── */}
            <section id="logos" style={{ ...S.section, ...S.logoSection }}>
                <div style={S.sectionLabel}>Roadmap</div>
                <p style={S.logoHeadline}>Future enhancements and planned features</p>
                <div style={S.logoGrid}>
                    {LOGOS.map((l) => (
                        <div key={l} style={S.logoChip} className="h-logo-chip">{l}</div>
                    ))}
                    <div style={{ ...S.logoChip, ...S.logoMore }} className="h-logo-chip">And more...</div>
                </div>
            </section>

            {/* ── FOOTER CTA ── */}
            <section style={S.ctaBanner}>
                <div style={S.ctaBannerInner}>
                    <div style={{ ...S.sectionLabel, color: "#888" }}>Get started</div>
                    <h2 style={{ ...S.sectionH2, fontSize: "clamp(2rem, 5vw, 3.2rem)", maxWidth: 560 }}>
                        Ready to ship<br />10× faster?
                    </h2>
                    <p style={{ ...S.sectionSub, maxWidth: 420 }}>
                        Free forever for individuals. No credit card required.
                        Scale with your team when you're ready.
                    </p>
                    <div style={S.ctaRow}>
                        <button className="h-cta-primary" onClick={goApp}>
                            Create your first workflow →
                        </button>
                        <button className="h-btn-ghost" style={{ padding: "12px 22px", fontSize: 14 }} onClick={() => navigate("/dashboard")}>
                            Book a demo
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={S.footer}>
                <div style={S.footerTop}>
                    <div style={S.footerBrand}>
                        <span style={S.logo}>ORG</span>
                        <p style={S.footerTagline}>Visual automation for engineering teams who move fast.</p>
                    </div>
                    <div style={S.footerLinks}>
                        {[
                            { heading: "Product", links: ["Features", "Integrations", "Pricing", "Changelog"] },
                            { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                            { heading: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
                        ].map((col) => (
                            <div key={col.heading} style={S.footerCol}>
                                <div style={S.footerColHead}>{col.heading}</div>
                                {col.links.map((l) => (
                                    <a key={l} href="#" style={S.footerColLink} className="h-nav-link">{l}</a>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div style={S.footerBottom}>
                    <p style={S.footerCopy}>© {new Date().getFullYear()} ORG, Inc. All rights reserved.</p>
                    <div style={{ display: "flex", gap: 20 }}>
                        {["Twitter", "GitHub", "LinkedIn"].map((s) => (
                            <a key={s} href="#" style={S.footerColLink} className="h-nav-link">{s}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}

/* ─── Page Styles ─── */
const S = {
    root: {
        minHeight: "100vh",
        background: "#fafafa",
        color: "#111",
        fontFamily: "'Geist', 'Inter', 'Helvetica Neue', sans-serif",
        overflowX: "hidden",
        paddingTop: 64,
    },
    logo: {
        fontFamily: "'Geist Mono', 'DM Mono', monospace",
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: "0.06em",
        color: "#111",
        flexShrink: 0,
    },

    /* Hero */
    heroSection: {
        maxWidth: 1160,
        margin: "0 auto",
        padding: "100px 40px 80px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 64,
        alignItems: "center",
        position: "relative",
    },
    gridBg: {
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(#e8e8e8 1px, transparent 1px), linear-gradient(90deg, #e8e8e8 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.4,
        maskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)",
        zIndex: 0,
        pointerEvents: "none",
    },
    heroContent: {
        position: "relative",
        zIndex: 1,
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 12px 5px 10px",
        background: "#f5f5f5",
        border: "1px solid #e5e5e5",
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 500,
        color: "#555",
        marginBottom: 24,
        cursor: "default",
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#22c55e",
        display: "inline-block",
    },
    badgeArrow: { color: "#aaa", marginLeft: 2 },
    h1: {
        fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
        fontWeight: 700,
        letterSpacing: "-0.04em",
        color: "#111",
        lineHeight: 1.08,
        margin: "0 0 20px",
    },
    h1Muted: { color: "#888" },
    subline: {
        fontSize: 16,
        color: "#666",
        lineHeight: 1.7,
        maxWidth: 480,
        margin: "0 0 32px",
    },
    ctaRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24, alignItems: "center" },
    terminalWrap: {
        position: "relative",
        zIndex: 1,
    },

    /* Stats */
    statsWrap: {
        padding: "0 40px",
        maxWidth: 1160,
        margin: "0 auto",
    },
    statsStrip: {
        display: "flex",
        border: "1px solid #e8e8e8",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        marginBottom: 80,
    },
    statItem: {
        flex: 1,
        padding: "28px 32px",
        borderRight: "1px solid #e8e8e8",
        cursor: "default",
        transition: "background 0.15s",
    },
    statNum: {
        fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
        fontWeight: 700,
        letterSpacing: "-0.04em",
        color: "#111",
        lineHeight: 1,
        marginBottom: 6,
        fontFamily: "'Geist Mono', monospace",
    },
    statLabel: {
        fontSize: 11,
        color: "#aaa",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
    },

    /* Sections */
    section: {
        maxWidth: 1160,
        margin: "0 auto 96px",
        padding: "0 40px",
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#aaa",
        marginBottom: 14,
        fontFamily: "'Geist Mono', monospace",
    },
    sectionH2: {
        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
        fontWeight: 700,
        letterSpacing: "-0.04em",
        color: "#111",
        lineHeight: 1.12,
        margin: "0 0 14px",
    },
    sectionSub: {
        fontSize: 15,
        color: "#888",
        lineHeight: 1.65,
        margin: "0 0 48px",
        maxWidth: 520,
    },

    /* Features */
    featGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 1,
        background: "#e8e8e8",
        border: "1px solid #e8e8e8",
        borderRadius: 14,
        overflow: "hidden",
    },
    featCard: {
        padding: "32px 28px",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        cursor: "default",
        transition: "background 0.15s",
    },
    featIconWrap: {
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        borderRadius: 8,
        marginBottom: 18,
        color: "#555",
        flexShrink: 0,
    },
    featTag: {
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#bbb",
        marginBottom: 10,
        fontFamily: "'Geist Mono', monospace",
    },
    featHead: {
        fontSize: 15,
        fontWeight: 600,
        color: "#111",
        letterSpacing: "-0.02em",
        lineHeight: 1.35,
        margin: "0 0 10px",
    },
    featBody: {
        fontSize: 13,
        color: "#888",
        lineHeight: 1.65,
        margin: 0,
        flexGrow: 1,
    },

    /* How it works */
    howSection: {
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 16,
        padding: "48px",
        maxWidth: 1160,
        margin: "0 auto 96px",
    },
    howGrid: {
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: 0,
        border: "1px solid #e8e8e8",
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 40,
    },
    stepList: {
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #e8e8e8",
    },
    stepLeft: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },
    stepNum: {
        fontFamily: "'Geist Mono', monospace",
        fontSize: 10,
        color: "#ccc",
        display: "block",
        letterSpacing: "0.04em",
    },
    stepLabel: {
        fontSize: 14,
        fontWeight: 600,
        color: "#555",
        letterSpacing: "-0.01em",
    },
    stepHint: {
        fontSize: 11,
        color: "#ccc",
        fontWeight: 500,
        whiteSpace: "nowrap",
        marginLeft: "auto",
    },
    stepDetail: {
        padding: "44px 52px",
        background: "#fafafa",
        minHeight: 300,
        display: "flex",
        alignItems: "flex-start",
    },
    stepBigNum: {
        fontFamily: "'Geist Mono', monospace",
        fontSize: "5rem",
        fontWeight: 700,
        letterSpacing: "-0.06em",
        color: "#ebebeb",
        lineHeight: 1,
        marginBottom: 8,
        userSelect: "none",
    },
    stepDetailHead: {
        fontSize: "1.6rem",
        fontWeight: 700,
        color: "#111",
        margin: "0 0 12px",
        letterSpacing: "-0.03em",
    },
    stepDetailBody: {
        color: "#777",
        fontSize: 15,
        lineHeight: 1.7,
        margin: 0,
    },
    stepHintPill: {
        display: "inline-block",
        marginTop: 16,
        padding: "4px 12px",
        background: "#f0f0f0",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 600,
        color: "#888",
        letterSpacing: "0.02em",
    },

    /* Roadmap */
    logoSection: { marginTop: 0 },
    logoHeadline: {
        fontSize: 15,
        color: "#888",
        margin: "0 0 28px",
        lineHeight: 1.5,
    },
    logoGrid: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
    },
    logoChip: {
        padding: "8px 18px",
        border: "1px solid #e8e8e8",
        borderRadius: 8,
        fontSize: 13,
        color: "#666",
        fontWeight: 500,
        background: "#fff",
        cursor: "default",
        transition: "border-color 0.15s, color 0.15s, transform 0.15s",
    },
    logoMore: {
        color: "#aaa",
        fontStyle: "italic",
        borderStyle: "dashed",
    },

    /* CTA Banner */
    ctaBanner: {
        background: "#fff",
        borderTop: "1px solid #e8e8e8",
        borderBottom: "1px solid #e8e8e8",
        marginBottom: 0,
    },
    ctaBannerInner: {
        maxWidth: 1160,
        margin: "0 auto",
        padding: "96px 40px",
    },

    /* Footer */
    footer: {
        maxWidth: 1160,
        margin: "0 auto",
        padding: "0 40px 48px",
    },
    footerTop: {
        display: "flex",
        gap: 64,
        padding: "48px 0 40px",
        borderBottom: "1px solid #e8e8e8",
        flexWrap: "wrap",
    },
    footerBrand: { flex: "0 0 200px" },
    footerTagline: {
        fontSize: 13,
        color: "#aaa",
        lineHeight: 1.6,
        marginTop: 10,
        maxWidth: 180,
    },
    footerLinks: {
        flex: 1,
        display: "flex",
        gap: 48,
        flexWrap: "wrap",
    },
    footerCol: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 100,
    },
    footerColHead: {
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        color: "#111",
        marginBottom: 4,
    },
    footerColLink: {
        fontSize: 13,
        color: "#888",
        textDecoration: "none",
        fontWeight: 400,
        transition: "color 0.15s",
    },
    footerBottom: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 24,
        flexWrap: "wrap",
        gap: 12,
    },
    footerCopy: {
        fontSize: 12,
        color: "#ccc",
        margin: 0,
    },
};

/* ─── CSS ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');

  .hero-page *,
  .hero-page *::before,
  .hero-page *::after { box-sizing: border-box; }

  /* ── Buttons ── */
  .h-cta-primary {
    display: inline-flex; align-items: center;
    padding: 12px 22px; background: #111; color: #fff;
    border: none; border-radius: 8px; font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: inherit; letter-spacing: -0.01em;
    transition: opacity 0.15s, transform 0.15s; white-space: nowrap;
  }
  .h-cta-primary:hover { opacity: 0.8; transform: translateY(-1px); }
  .h-cta-primary:active { transform: translateY(0); opacity: 0.7; }

  .h-btn-ghost {
    display: inline-flex; align-items: center;
    padding: 8px 16px; background: transparent; color: #555;
    border: 1px solid #e5e5e5; border-radius: 6px; font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: inherit;
    transition: border-color 0.15s, color 0.15s, background 0.15s; white-space: nowrap;
  }
  .h-btn-ghost:hover { border-color: #bbb; color: #111; background: #f9f9f9; }

  /* ── Pulse ── */
  .pulse-dot {
    display: inline-block; border-radius: 50%;
    animation: pulseAnim 2s ease-in-out infinite;
  }
  @keyframes pulseAnim {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50%       { box-shadow: 0 0 0 4px rgba(34,197,94,0); }
  }

  /* ── Stat hover ── */
  .h-stat:hover { background: #f9f9f9; }
  .h-stat:last-child { border-right: none !important; }

  /* ── Feature cards ── */
  .h-feat-card:hover { background: #f9f9f9 !important; }
  .h-feat-card:last-child { border-right: none !important; }

  /* ── Step buttons ── */
  .h-step-btn {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 22px; background: transparent; border: none;
    border-bottom: 1px solid #e8e8e8; cursor: pointer; text-align: left;
    width: 100%; font-family: inherit; transition: background 0.12s; position: relative;
  }
  .h-step-btn::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
    background: #111; transform: scaleY(0); transform-origin: center;
    transition: transform 0.25s ease; border-radius: 0 2px 2px 0;
  }
  .h-step-btn:last-child { border-bottom: none; }
  .h-step-btn:hover { background: #f5f5f5; }
  .h-step-btn:hover .step-hint { opacity: 1; }
  .step-hint { opacity: 0; transition: opacity 0.2s; }
  .h-step-active { background: #f5f5f5 !important; }
  .h-step-active::before { transform: scaleY(1) !important; }
  .h-step-active .step-hint { opacity: 1 !important; }
  .h-step-active span { color: #111 !important; }

  /* Step detail slide */
  .h-step-inner { animation: stepSlide 0.35s cubic-bezier(0.22,1,0.36,1); }
  @keyframes stepSlide {
    from { opacity: 0; transform: translateX(14px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Logo chips ── */
  .h-logo-chip:hover { border-color: #bbb; color: #111; transform: translateY(-2px); }

  /* ── Nav links ── */
  .h-nav-link:hover { color: #111 !important; }

  /* ── Sidebar item hover ── */
  .mc-sb-item:hover { background: #2a2a32; }

  /* ── Mobile ── */
  @media (max-width: 860px) {
    section[style*="grid-template-columns: 1fr 1fr"] {
      grid-template-columns: 1fr !important;
    }
    div[style*="repeat(4, 1fr)"] {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    div[style*="220px 1fr"] {
      grid-template-columns: 1fr !important;
    }
  }
  @media (max-width: 540px) {
    div[style*="repeat(4, 1fr)"],
    div[style*="repeat(2, 1fr)"] {
      grid-template-columns: 1fr !important;
    }
  }
`;
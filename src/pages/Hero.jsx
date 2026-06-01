import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Animated number counter ─── */
function Counter({ target, suffix = "" }) {
    const [val, setVal] = useState(0);
    const ref = useRef();
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            io.disconnect();
            const numeric = parseFloat(target);
            const frames = 60;
            let i = 0;
            const id = setInterval(() => {
                i++;
                const ease = 1 - Math.pow(1 - i / frames, 3);
                setVal(Math.min(numeric, numeric * ease));
                if (i >= frames) clearInterval(id);
            }, 16);
        });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, [target]);
    const isFloat = typeof target === "string" ? target.includes(".") : target % 1 !== 0;
    return <span ref={ref}>{isFloat ? val.toFixed(1) : Math.round(val)}{suffix}</span>;
}

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

const LOGOS = ["Slack", "Stripe", "GitHub", "Notion", "AWS", "Linear", "Figma", "Airtable", "Twilio", "Vercel"];

const TESTIMONIALS = [
    { quote: "ORG cut our integration time from weeks to hours. It's the automation layer we always wanted.", name: "Sarah Chen", role: "Staff Engineer, Vercel" },
    { quote: "The GraphQL-first approach is genius. Our frontend team can query workflow state directly.", name: "Marcus Webb", role: "CTO, Linear" },
    { quote: "We replaced 4 internal tools with ORG. Deployment went from a chore to a celebration.", name: "Priya Nair", role: "Head of Platform, Loom" },
];

export default function Hero() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [activeTesti, setActiveTesti] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    // Auto-advance testimonials
    useEffect(() => {
        const t = setInterval(() => setActiveTesti(p => (p + 1) % TESTIMONIALS.length), 4000);
        return () => clearInterval(t);
    }, []);

    const goApp = () => {
        const token = localStorage.getItem("token");
        navigate(token ? "/dashboard" : "/login");
    };

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
    });

    return (
        <div style={S.root} className="hero-page">
            <style>{CSS}</style>


            {/* ── HERO ── */}
            <section style={S.heroSection}>
                {/* Subtle grid background */}
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
                        <span>v2.0 — AI-assisted branching</span>
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

                    {/* Social proof */}
                    <div style={S.socialRow}>
                        <div style={S.avatarStack}>
                            {["#c9b8a8", "#b8c9a8", "#a8b8c9", "#c9a8b8"].map((c, i) => (
                                <div key={i} style={{ ...S.avatar, background: c, marginLeft: i === 0 ? 0 : -10, zIndex: 4 - i }} />
                            ))}
                        </div>
                        <p style={S.socialProof}>
                            <strong style={{ color: "#111" }}>12,000+</strong> teams already automating
                        </p>
                    </div>
                </div>

                {/* Terminal / code preview card */}
                <div style={{
                    ...S.terminalWrap,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "none" : "translateY(24px)",
                    transition: "opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s",
                }}>
                    <div style={S.terminal}>
                        <div style={S.termBar}>
                            <div style={S.termDots}>
                                <span style={{ ...S.termDot, background: "#ff5f57" }} />
                                <span style={{ ...S.termDot, background: "#febc2e" }} />
                                <span style={{ ...S.termDot, background: "#28c840" }} />
                            </div>
                            <span style={S.termTitle}>order-pipeline.graphql</span>
                            <span style={S.termLive}>
                                <span className="pulse-dot" style={{ background: "#22c55e", width: 5, height: 5 }} />
                                Live
                            </span>
                        </div>
                        <pre style={S.termBody}>{GQL}</pre>
                        <div style={S.termFooter}>
                            <div style={S.termStat}>
                                <span style={{ color: "#22c55e", fontWeight: 600 }}>3</span> running
                            </div>
                            <div style={S.termStat}>
                                <span style={{ color: "#111", fontWeight: 600 }}>84ms</span> avg
                            </div>
                            <div style={S.termStat}>
                                <span style={{ color: "#111", fontWeight: 600 }}>99.9%</span> uptime
                            </div>
                        </div>
                    </div>

                    {/* Floating badges */}
                    <div style={{ ...S.floatBadge, top: -14, right: 32 }} className="float-a">
                        <span style={S.floatIcon}>⚡</span> Deployed in 1 click
                    </div>
                    <div style={{ ...S.floatBadge, bottom: -14, left: 24 }} className="float-b">
                        <span style={S.floatIcon}>🔗</span> 200+ integrations
                    </div>
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
                        { val: "200", suffix: "+", label: "Integrations" },
                        { val: "50", suffix: "K+", label: "Workflows built" },
                        { val: "99.9", suffix: "%", label: "Uptime SLA" },
                        { val: null, raw: "<1s", label: "Avg latency" },
                    ].map((s, i) => (
                        <div key={s.label} style={S.statItem} className="h-stat">
                            <div style={S.statNum}>
                                {s.raw ? s.raw : <Counter target={s.val} suffix={s.suffix} />}
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
                                {f.headline.split("\n").map((l, j) => <span key={j}>{l}{j === 0 && <br />}</span>)}
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

            {/* ── LOGOS ── */}
            <section id="logos" style={{ ...S.section, ...S.logoSection }}>
                <div style={S.sectionLabel}>Integrations</div>
                <p style={S.logoHeadline}>Connects with the tools your team already loves</p>
                <div style={S.logoGrid}>
                    {LOGOS.map((l) => (
                        <div key={l} style={S.logoChip} className="h-logo-chip">{l}</div>
                    ))}
                    <div style={{ ...S.logoChip, ...S.logoMore }} className="h-logo-chip">+190 more</div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section style={{ ...S.section, ...S.testiSection }}>
                <div style={S.sectionLabel}>Social proof</div>
                <h2 style={S.sectionH2}>Loved by engineering teams</h2>

                <div style={S.testiGrid}>
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            style={{
                                ...S.testiCard,
                                ...(activeTesti === i ? S.testiCardActive : {}),
                            }}
                            className="h-testi-card"
                            onClick={() => setActiveTesti(i)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e5e5e5" style={{ marginBottom: 14, flexShrink: 0 }}>
                                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .757-2 2v11c0 1 .28 2 1.5 2zm9 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .757-2 2v11c0 1 .28 2 1.5 2z" />
                            </svg>
                            <p style={S.testiQuote}>{t.quote}</p>
                            <div style={S.testiAuthor}>
                                <div style={{ ...S.avatar, background: ["#c9b8a8", "#b8c9a8", "#a8b8c9"][i], width: 32, height: 32, fontSize: 12 }}>
                                    {t.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <div style={S.testiName}>{t.name}</div>
                                    <div style={S.testiRole}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dot nav */}
                <div style={S.testiDots}>
                    {TESTIMONIALS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTesti(i)}
                            style={{ ...S.testiDot, ...(activeTesti === i ? S.testiDotActive : {}) }}
                            aria-label={`Testimonial ${i + 1}`}
                        />
                    ))}
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
                    <p style={{ ...S.socialProof, marginTop: 20, color: "#bbb" }}>
                        Trusted by <strong style={{ color: "#888" }}>12,000+</strong> engineering teams
                    </p>
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

const GQL = `query GetWorkflowRuns {
  workflow(id: "order-pipeline") {
    name
    status        # ACTIVE
    runs(last: 3) {
      edges {
        node {
          id
          status    # SUCCESS
          durationMs
          output
        }
      }
    }
  }
}`;

/* ─── Styles ─── */
const S = {
    root: {
        minHeight: "100vh",
        background: "#fafafa",
        color: "#111",
        fontFamily: "'Geist', 'Inter', 'Helvetica Neue', sans-serif",
        overflowX: "hidden",
        paddingTop: 64,
    },

    /* Topbar */
    //   topbar: {
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "space-between",
    //     padding: "0 40px",
    //     height: 60,
    //     borderBottom: "1px solid #e8e8e8",
    //     background: "rgba(255,255,255,0.92)",
    //     backdropFilter: "blur(12px)",
    //     WebkitBackdropFilter: "blur(12px)",
    //     position: "sticky",
    //     top: 0,
    //     zIndex: 100,
    //   },
    logo: {
        fontFamily: "'Geist Mono', 'DM Mono', monospace",
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: "0.06em",
        color: "#111",
        flexShrink: 0,
    },
    //   navLinks: { display: "flex", alignItems: "center", gap: 4 },
    //   navLink: {
    //     padding: "6px 12px",
    //     color: "#666",
    //     textDecoration: "none",
    //     fontSize: 13,
    //     fontWeight: 500,
    //     borderRadius: 6,
    //     transition: "color 0.15s, background 0.15s",
    //   },
    //   topbarRight: { display: "flex", alignItems: "center", gap: 10 },
    //   topbarMeta: { fontSize: 12, color: "#bbb", marginRight: 4 },
    //   hamburgerLine: {
    //     display: "block",
    //     width: 18,
    //     height: 1.5,
    //     background: "#111",
    //     borderRadius: 2,
    //     transition: "transform 0.2s, opacity 0.2s",
    //   },

    /* Mobile menu */
    //   mobileMenu: {
    //     position: "fixed",
    //     top: 60,
    //     left: 0,
    //     right: 0,
    //     background: "#fff",
    //     borderBottom: "1px solid #e8e8e8",
    //     zIndex: 99,
    //     display: "flex",
    //     flexDirection: "column",
    //   },
    //   mobileNavLink: {
    //     padding: "14px 24px",
    //     color: "#444",
    //     textDecoration: "none",
    //     fontSize: 14,
    //     fontWeight: 500,
    //     borderBottom: "1px solid #f0f0f0",
    //   },

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
    socialRow: { display: "flex", alignItems: "center", gap: 12 },
    avatarStack: { display: "flex", alignItems: "center" },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: "50%",
        border: "2px solid #fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: 600,
        color: "#fff",
        flexShrink: 0,
    },
    socialProof: { fontSize: 13, color: "#888", margin: 0 },

    /* Terminal */
    terminalWrap: {
        position: "relative",
        zIndex: 1,
    },
    terminal: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 16px 48px -8px rgba(0,0,0,0.08)",
    },
    termBar: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px",
        borderBottom: "1px solid #f0f0f0",
        background: "#fafafa",
    },
    termDots: { display: "flex", gap: 6 },
    termDot: { width: 10, height: 10, borderRadius: "50%" },
    termTitle: {
        fontSize: 12,
        color: "#888",
        fontFamily: "'Geist Mono', monospace",
        flex: 1,
        textAlign: "center",
    },
    termLive: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        color: "#22c55e",
        background: "#f0fdf4",
        padding: "3px 8px",
        borderRadius: 100,
        border: "1px solid #bbf7d0",
    },
    termBody: {
        margin: 0,
        padding: "20px",
        fontFamily: "'Geist Mono', 'DM Mono', monospace",
        fontSize: 12,
        lineHeight: 1.8,
        color: "#555",
        background: "#fff",
        overflowX: "auto",
    },
    termFooter: {
        display: "flex",
        gap: 24,
        padding: "12px 20px",
        borderTop: "1px solid #f0f0f0",
        background: "#fafafa",
    },
    termStat: {
        fontSize: 12,
        color: "#888",
        display: "flex",
        gap: 6,
        alignItems: "center",
    },
    floatBadge: {
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 14px",
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 500,
        color: "#444",
        boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
        whiteSpace: "nowrap",
    },
    floatIcon: { fontSize: 14 },

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

    /* Logos */
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

    /* Testimonials */
    testiSection: { marginTop: 0 },
    testiGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 24,
    },
    testiCard: {
        padding: "28px",
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 12,
        cursor: "pointer",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: 0,
    },
    testiCardActive: {
        borderColor: "#111",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        transform: "translateY(-2px)",
    },
    testiQuote: {
        fontSize: 14,
        color: "#555",
        lineHeight: 1.7,
        margin: "0 0 20px",
        flexGrow: 1,
    },
    testiAuthor: {
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    testiName: {
        fontSize: 13,
        fontWeight: 600,
        color: "#111",
        letterSpacing: "-0.01em",
    },
    testiRole: {
        fontSize: 11,
        color: "#aaa",
        fontWeight: 500,
    },
    testiDots: {
        display: "flex",
        gap: 8,
        justifyContent: "center",
    },
    testiDot: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#e5e5e5",
        border: "none",
        cursor: "pointer",
        transition: "background 0.2s, transform 0.2s",
        padding: 0,
    },
    testiDotActive: {
        background: "#111",
        transform: "scale(1.3)",
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
    footerBrand: {
        flex: "0 0 200px",
    },
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
.hero-page *::after {
  box-sizing: border-box;
}
  /* ── Buttons ── */
  .h-cta-primary {
    display: inline-flex;
    align-items: center;
    padding: 12px 22px;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: -0.01em;
    transition: opacity 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .h-cta-primary:hover { opacity: 0.8; transform: translateY(-1px); }
  .h-cta-primary:active { transform: translateY(0); opacity: 0.7; }

  .h-btn-primary {
    display: inline-flex; align-items: center;
    padding: 8px 16px; background: #111; color: #fff;
    border: none; border-radius: 6px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: inherit; letter-spacing: -0.01em;
    transition: opacity 0.15s; white-space: nowrap;
  }
  .h-btn-primary:hover { opacity: 0.75; }

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
    display: inline-block;
    border-radius: 50%;
    animation: pulseAnim 2s ease-in-out infinite;
  }
  @keyframes pulseAnim {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
    50% { box-shadow: 0 0 0 4px rgba(34, 197, 94, 0); }
  }

  /* ── Floating badges ── */
  .float-a { animation: floatA 4s ease-in-out infinite; }
  .float-b { animation: floatB 5s ease-in-out infinite; }
  @keyframes floatA {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  /* ── Stat hover ── */
  .h-stat:hover { background: #f9f9f9; }
  .h-stat:last-child { border-right: none !important; }

  /* ── Feature cards ── */
  .h-feat-card:hover { background: #f9f9f9 !important; }
  .h-feat-card:last-child { border-right: none !important; }

  /* ── Step buttons ── */
  .h-step-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 22px;
    background: transparent;
    border: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    text-align: left;
    width: 100%;
    font-family: inherit;
    transition: background 0.12s;
    position: relative;
  }
  .h-step-btn::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: #111;
    transform: scaleY(0);
    transform-origin: center;
    transition: transform 0.25s ease;
    border-radius: 0 2px 2px 0;
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

  /* ── Testimonial cards ── */
  .h-testi-card:hover { border-color: #ccc; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }

  /* ── Nav links ── */
  .h-nav-link:hover { color: #111 !important; background: #f5f5f5 !important; }

  /* ── Mobile ── */
  .h-hamburger {
    display: none;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    background: none;
    border: none;
    cursor: pointer;
  }
  .mobile-menu-in { animation: menuIn 0.2s ease; }
  @keyframes menuIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    .desk-nav { display: none !important; }
    .desk-meta { display: none !important; }
    .h-hamburger { display: flex !important; }
  }

  @media (max-width: 860px) {
    /* Hero stacks */
    section[style*="grid-template-columns: 1fr 1fr"] {
      grid-template-columns: 1fr !important;
    }
    /* Features */
    div[style*="repeat(4, 1fr)"] {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    /* Stats */
    div[style*="statsStrip"] {
      flex-wrap: wrap;
    }
    /* How it works */
    div[style*="220px 1fr"] {
      grid-template-columns: 1fr !important;
    }
    /* Testimonials */
    div[style*="repeat(3, 1fr)"] {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 540px) {
    div[style*="repeat(4, 1fr)"],
    div[style*="repeat(2, 1fr)"] {
      grid-template-columns: 1fr !important;
    }
    .h-feat-card:last-child { border-right: 0 !important; }
  }
`;
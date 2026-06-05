import { useState, useEffect } from "react";

export default function GraphQL() {
    const [mounted, setMounted] = useState(false);
    const [notifyEmail, setNotifyEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    const handleNotify = () => {
        if (notifyEmail.trim()) {
            setSubmitted(true);
        }
    };

    return (
        <div style={S.root}>
            <style>{CSS}</style>
            <div style={S.gridBg} aria-hidden />

            <div style={{
                ...S.page,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(16px)",
                transition: "opacity 0.6s ease, transform 0.6s ease"
            }} className="m-page">

                <div style={S.header}>
                    <div style={S.sectionLabel}>API</div>
                    <h1 style={S.h1}>GraphQL API</h1>
                    <p style={S.subtitle}>Access your workflow data and trigger runs programmatically.</p>
                </div>

                <div style={S.heroCard}>
                    <div style={S.iconWrap} aria-hidden>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5" r="2"/>
                            <circle cx="5" cy="19" r="2"/>
                            <circle cx="19" cy="19" r="2"/>
                            <line x1="12" y1="7" x2="5.5" y2="17.2"/>
                            <line x1="12" y1="7" x2="18.5" y2="17.2"/>
                            <line x1="6.8" y1="19" x2="17.2" y2="19"/>
                        </svg>
                    </div>

                    <div style={S.badge}>Coming Soon</div>

                    <h2 style={S.heroTitle}>GraphQL support is on its way</h2>
                    <p style={S.heroDesc}>
                        We're building a full-featured GraphQL API to let you query workflows,
                        trigger runs, and subscribe to real-time updates — all from a single endpoint.
                    </p>

                    <div style={S.featureGrid}>
                        {[
                            { icon: "⚡", label: "Flexible queries", desc: "Fetch exactly the data you need, nothing more." },
                            { icon: "🔔", label: "Subscriptions", desc: "Real-time updates pushed straight to your client." },
                            { icon: "🔑", label: "API key auth", desc: "Secure, scoped keys per workspace or project." },
                            { icon: "📖", label: "Schema explorer", desc: "Interactive docs and introspection built in." },
                        ].map(f => (
                            <div style={S.featureCard} key={f.label}>
                                <span style={S.featureIcon}>{f.icon}</span>
                                <div>
                                    <div style={S.featureLabel}>{f.label}</div>
                                    <div style={S.featureDesc}>{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!submitted ? (
                        <div style={S.notifyRow} className="m-notify-row">
                            <input
                                style={S.input}
                                className="g-input"
                                type="email"
                                placeholder="your@email.com"
                                value={notifyEmail}
                                onChange={e => setNotifyEmail(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleNotify()}
                            />
                            <button className="g-btn-primary" onClick={handleNotify}>
                                Notify me
                            </button>
                        </div>
                    ) : (
                        <div style={S.successRow}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style={S.successText}>You're on the list — we'll ping you when it's ready.</span>
                        </div>
                    )}
                </div>

                <div style={S.previewCard}>
                    <div style={S.previewLabel}>Preview</div>
                    <div style={S.editorMock}>
                        <div style={S.editorTop}>
                            <div style={S.editorDots}>
                                <span style={{...S.dot, background: "#ff5f57"}} />
                                <span style={{...S.dot, background: "#febc2e"}} />
                                <span style={{...S.dot, background: "#28c840"}} />
                            </div>
                            <span style={S.editorTitle}>query.graphql</span>
                            <span style={S.editorPill}>coming soon</span>
                        </div>
                        <pre style={S.pre} aria-hidden>
<span style={{color:"#c678dd"}}>query</span> <span style={{color:"#61afef"}}>GetWorkflows</span> {'{\n'}
  <span style={{color:"#e06c75"}}>workflows</span>(first: <span style={{color:"#d19a66"}}>10</span>) {'{\n'}
    <span style={{color:"#e06c75"}}>edges</span> {'{\n'}
      <span style={{color:"#e06c75"}}>node</span> {'{\n'}
        <span style={{color:"#abb2bf"}}>id</span>{'\n'}
        <span style={{color:"#abb2bf"}}>name</span>{'\n'}
        <span style={{color:"#abb2bf"}}>isActive</span>{'\n'}
        <span style={{color:"#abb2bf"}}>createdAt</span>{'\n'}
      {'}\n'}
    {'}\n'}
  {'}\n'}
{'}'}
                        </pre>
                    </div>
                    <div style={S.overlay} aria-hidden>
                        <div style={S.overlayLock}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <span style={S.overlayText}>Not yet available</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const S = {
    root: {
        minHeight: "100vh",
        background: "#fafafa",
        color: "#111",
        fontFamily: "'Geist', 'Inter', sans-serif",
        position: "relative",
        overflowX: "hidden",
    },
    gridBg: {
        position: "fixed",
        inset: 0,
        backgroundImage: "linear-gradient(#e8e8e8 1px, transparent 1px), linear-gradient(90deg, #e8e8e8 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.35,
        maskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)",
        zIndex: 0,
        pointerEvents: "none",
    },
    page: {
        position: "relative",
        zIndex: 1,
        maxWidth: 900,
        margin: "0 auto",
        padding: "120px 40px 80px",
    },
    header: {
        marginBottom: 40,
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
    h1: {
        fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
        fontWeight: 700,
        letterSpacing: "-0.04em",
        color: "#111",
        margin: "0 0 8px",
        lineHeight: 1.1,
    },
    subtitle: {
        fontSize: 15,
        color: "#888",
        margin: 0,
    },
    heroCard: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        padding: "40px",
        marginBottom: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    },
    iconWrap: {
        width: 60,
        height: 60,
        borderRadius: 14,
        background: "#f5f5f5",
        border: "1px solid #e5e5e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#555",
        marginBottom: 20,
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        background: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        color: "#b45309",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontFamily: "'Geist Mono', monospace",
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
        fontWeight: 700,
        letterSpacing: "-0.03em",
        color: "#111",
        margin: "0 0 12px",
    },
    heroDesc: {
        fontSize: 15,
        color: "#666",
        maxWidth: 480,
        lineHeight: 1.65,
        margin: "0 0 32px",
    },
    featureGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 12,
        width: "100%",
        maxWidth: 560,
        marginBottom: 36,
        textAlign: "left",
    },
    featureCard: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        background: "#fafafa",
        border: "1px solid #ebebeb",
        borderRadius: 10,
        padding: "14px 16px",
    },
    featureIcon: {
        fontSize: 18,
        lineHeight: 1,
        marginTop: 1,
        flexShrink: 0,
    },
    featureLabel: {
        fontSize: 13,
        fontWeight: 600,
        color: "#111",
        marginBottom: 2,
    },
    featureDesc: {
        fontSize: 12,
        color: "#888",
        lineHeight: 1.5,
    },
    notifyRow: {
        display: "flex",
        gap: 10,
        width: "100%",
        maxWidth: 420,
    },
    input: {
        flex: 1,
        padding: "10px 14px",
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        fontFamily: "'Geist', 'Inter', sans-serif",
        fontSize: 13,
        color: "#111",
        background: "#fff",
        outline: "none",
        transition: "border-color 0.15s",
    },
    successRow: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: 8,
    },
    successText: {
        fontSize: 13,
        color: "#15803d",
        fontWeight: 500,
    },
    previewCard: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        padding: "24px",
        position: "relative",
        overflow: "hidden",
    },
    previewLabel: {
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#aaa",
        marginBottom: 14,
        fontFamily: "'Geist Mono', monospace",
    },
    editorMock: {
        background: "#1e1e1e",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #333",
    },
    editorTop: {
        background: "#252526",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: "1px solid #333",
    },
    editorDots: { display: "flex", gap: 6 },
    dot: { width: 10, height: 10, borderRadius: "50%", opacity: 0.4 },
    editorTitle: {
        fontSize: 12,
        color: "#888",
        fontFamily: "'Geist Mono', monospace",
        flex: 1,
    },
    editorPill: {
        fontSize: 10,
        fontWeight: 600,
        color: "#b45309",
        background: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: 4,
        padding: "2px 7px",
        fontFamily: "'Geist Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    pre: {
        margin: 0,
        padding: "20px",
        fontFamily: "'Geist Mono', monospace",
        fontSize: 13,
        lineHeight: 1.6,
        color: "#abb2bf",
        overflowX: "auto",
        opacity: 0.45,
        filter: "blur(0.5px)",
        userSelect: "none",
    },
    overlay: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.97) 80%)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 28,
        pointerEvents: "none",
    },
    overlayLock: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 20,
        color: "#888",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    },
    overlayText: {
        fontSize: 12,
        fontWeight: 500,
        color: "#888",
    },
};

const CSS = `
  .g-btn-primary {
    display: inline-flex;
    align-items: center;
    padding: 10px 18px;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Geist', 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .g-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .g-input:focus { border-color: #bbb !important; }
  @media (max-width: 768px) {
    .m-page { padding: 90px 20px 60px !important; }
    .m-notify-row { flex-direction: column; }
    .m-notify-row button { width: 100%; justify-content: center; }
  }
`;
import { useState, useEffect } from "react";

export default function Integrations() {
    const [mounted, setMounted] = useState(false);
    const [notifyEmail, setNotifyEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    const apps = [
        { name: "Slack", icon: "💬", desc: "Send messages and notifications to channels." },
        { name: "Stripe", icon: "💳", desc: "Listen to payment webhooks and manage customers." },
        { name: "GitHub", icon: "🐙", desc: "Trigger workflows on push, PR, or release events." },
        { name: "Notion", icon: "📝", desc: "Read and write to databases and pages." },
        { name: "AWS S3", icon: "🪣", desc: "Read, upload, and manage files in buckets." },
        { name: "Linear", icon: "🎯", desc: "Create and update issues automatically." },
    ];

    const handleNotify = () => {
        if (notifyEmail.trim()) setSubmitted(true);
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
                    <div style={S.sectionLabel}>Integrations</div>
                    <h1 style={S.h1}>App Integrations</h1>
                    <p style={S.subtitle}>Connect your favorite tools to automate workflows seamlessly.</p>
                </div>

                {/* Coming soon banner */}
                <div style={S.bannerCard}>
                    <div style={S.bannerLeft}>
                        <div style={S.badge}>Coming Soon</div>
                        <h2 style={S.bannerTitle}>Integrations are on the way</h2>
                        <p style={S.bannerDesc}>
                            We're building native connections to the tools you already use — starting with the
                            most requested ones below. Get notified when the first integrations go live.
                        </p>
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
                                <button className="g-btn-primary" onClick={handleNotify}>Notify me</button>
                            </div>
                        ) : (
                            <div style={S.successRow}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                                <span style={S.successText}>You're on the list — we'll ping you when it's ready.</span>
                            </div>
                        )}
                    </div>
                    <div style={S.bannerStats} className="m-stats">
                        {[["6+", "Integrations planned"], ["Q3", "Target launch"], ["Free", "On all plans"]].map(([val, label]) => (
                            <div style={S.stat} key={label}>
                                <div style={S.statVal}>{val}</div>
                                <div style={S.statLabel}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dimmed app grid */}
                <div style={S.gridSection}>
                    <div style={S.gridHeading}>
                        <span style={S.gridLabel}>Planned integrations</span>
                        <span style={S.gridNote}>Not yet available</span>
                    </div>
                    <div style={S.grid}>
                        {apps.map((app, i) => (
                            <div
                                key={app.name}
                                style={{ ...S.card, animationDelay: `${i * 40}ms` }}
                                className="i-card"
                            >
                                <div style={S.cardHeader}>
                                    <div style={S.appIcon}>{app.icon}</div>
                                    <span style={S.comingSoonPill}>Soon</span>
                                </div>
                                <div style={S.appName}>{app.name}</div>
                                <div style={S.appDesc}>{app.desc}</div>
                            </div>
                        ))}
                    </div>
                    {/* Fade overlay */}
                    <div style={S.gridOverlay} aria-hidden>
                        <div style={S.overlayLock}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <span>Not yet available</span>
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
        maxWidth: 1080,
        margin: "0 auto",
        padding: "120px 40px 80px",
    },
    header: { marginBottom: 40 },
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
    subtitle: { fontSize: 15, color: "#888", margin: 0 },

    bannerCard: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        padding: "36px 40px",
        marginBottom: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 40,
        flexWrap: "wrap",
    },
    bannerLeft: { flex: 1, minWidth: 280 },
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
        marginBottom: 16,
    },
    bannerTitle: {
        fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
        fontWeight: 700,
        letterSpacing: "-0.03em",
        color: "#111",
        margin: "0 0 10px",
    },
    bannerDesc: {
        fontSize: 14,
        color: "#666",
        lineHeight: 1.65,
        margin: "0 0 24px",
        maxWidth: 440,
    },
    notifyRow: {
        display: "flex",
        gap: 10,
        maxWidth: 400,
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
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: 8,
    },
    successText: { fontSize: 13, color: "#15803d", fontWeight: 500 },
    bannerStats: {
        display: "flex",
        gap: 32,
        flexShrink: 0,
    },
    stat: { textAlign: "center" },
    statVal: {
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: "-0.04em",
        color: "#111",
        lineHeight: 1,
        marginBottom: 4,
    },
    statLabel: { fontSize: 12, color: "#999", fontWeight: 500 },

    gridSection: {
        position: "relative",
    },
    gridHeading: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    gridLabel: {
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#aaa",
        fontFamily: "'Geist Mono', monospace",
    },
    gridNote: {
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 600,
        color: "#aaa",
        gap: 5,
        fontFamily: "'Geist Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
        gap: 20,
        opacity: 0.45,
        filter: "grayscale(0.3)",
        pointerEvents: "none",
        userSelect: "none",
    },
    card: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: "24px",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    appIcon: {
        width: 44,
        height: 44,
        background: "#fafafa",
        border: "1px solid #e5e5e5",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
    },
    comingSoonPill: {
        fontSize: 10,
        fontWeight: 700,
        color: "#b45309",
        background: "#fffbeb",
        border: "1px solid #fde68a",
        padding: "3px 8px",
        borderRadius: 4,
        fontFamily: "'Geist Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    },
    appName: {
        fontSize: 16,
        fontWeight: 600,
        color: "#111",
        letterSpacing: "-0.02em",
        marginBottom: 6,
    },
    appDesc: { fontSize: 13, color: "#888", lineHeight: 1.5 },

    gridOverlay: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, transparent 30%, rgba(250,250,250,0.97) 85%)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 24,
        pointerEvents: "none",
    },
    overlayLock: {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 16px",
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        color: "#888",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
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
    .m-stats { width: 100%; justify-content: space-between; }
  }
`;
import { useState, useEffect } from "react";

export default function Integrations() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    const apps = [
        { name: "Slack", icon: "💬", status: "Connected", desc: "Send messages and notifications to channels." },
        { name: "Stripe", icon: "💳", status: "Connect", desc: "Listen to payment webhooks and manage customers." },
        { name: "GitHub", icon: "🐙", status: "Connect", desc: "Trigger workflows on push, PR, or release events." },
        { name: "Notion", icon: "📝", status: "Connected", desc: "Read and write to databases and pages." },
        { name: "AWS S3", icon: "🪣", status: "Connect", desc: "Read, upload, and manage files in buckets." },
        { name: "Linear", icon: "🎯", status: "Connect", desc: "Create and update issues automatically." }
    ];

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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }} className="m-header-row">
                        <div>
                            <h1 style={S.h1}>App Integrations</h1>
                            <p style={S.subtitle}>Connect your favorite tools to automate workflows seamlessly.</p>
                        </div>
                        <div style={S.searchBox} className="m-search">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round">
                                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input placeholder="Search apps..." style={S.searchInput} />
                        </div>
                    </div>
                </div>

                <div style={S.grid}>
                    {apps.map((app, i) => (
                        <div key={app.name} style={{ ...S.card, animationDelay: `${i * 40}ms` }} className="i-card">
                            <div style={S.cardHeader}>
                                <div style={S.appIcon}>{app.icon}</div>
                                {app.status === "Connected" ? (
                                    <span style={S.statusConnected}>Connected</span>
                                ) : (
                                    <button className="i-btn-connect">Connect</button>
                                )}
                            </div>
                            <div style={S.appName}>{app.name}</div>
                            <div style={S.appDesc}>{app.desc}</div>
                        </div>
                    ))}
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
    searchBox: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        padding: "0 12px",
        height: 38,
        background: "#fff",
        width: 240,
    },
    searchInput: {
        background: "transparent",
        border: "none",
        outline: "none",
        fontSize: 13,
        color: "#111",
        width: "100%",
        fontFamily: "inherit",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
        gap: 20,
    },
    card: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: "24px",
        transition: "border-color 0.15s, box-shadow 0.15s",
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
    appName: {
        fontSize: 16,
        fontWeight: 600,
        color: "#111",
        letterSpacing: "-0.02em",
        marginBottom: 6,
    },
    appDesc: {
        fontSize: 13,
        color: "#888",
        lineHeight: 1.5,
    },
    statusConnected: {
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 600,
        color: "#16a34a",
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        padding: "4px 10px",
        borderRadius: 100,
        fontFamily: "'Geist Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    }
};

const CSS = `
  .i-card:hover {
    border-color: #ddd;
    box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  }
  .i-btn-connect {
    background: transparent;
    border: 1px solid #e5e5e5;
    color: #111;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .i-btn-connect:hover {
    background: #fafafa;
    border-color: #ccc;
  }
  @media (max-width: 768px) {
    .m-page { padding: 90px 20px 60px !important; }
    .m-header-row { flex-direction: column; gap: 16px; align-items: stretch !important; }
    .m-search { width: 100% !important; }
  }
`;

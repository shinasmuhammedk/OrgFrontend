import { useState, useEffect } from "react";

export default function Services() {
    const [mounted, setMounted] = useState(false);
    const [notifyEmail, setNotifyEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    const handleNotify = () => {
        if (notifyEmail.trim()) setSubmitted(true);
    };

    const planned = [
        { icon: "🗄️", label: "Databases", desc: "PostgreSQL, MySQL, MongoDB, and more." },
        { icon: "🔌", label: "Internal APIs", desc: "Plug in your own REST or gRPC endpoints." },
        { icon: "🔐", label: "Secret management", desc: "Securely store and inject credentials." },
        { icon: "🌐", label: "Private networks", desc: "Connect services inside your VPC." },
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
                    <div style={S.sectionLabel}>Services</div>
                    <h1 style={S.h1}>Connected Services</h1>
                    <p style={S.subtitle}>Manage your databases, internal APIs, and custom service connections.</p>
                </div>

                <div style={S.heroCard}>
                    <div style={S.iconWrap} aria-hidden>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="8" rx="2"/>
                            <rect x="2" y="14" width="20" height="8" rx="2"/>
                            <line x1="6" y1="6" x2="6.01" y2="6"/>
                            <line x1="6" y1="18" x2="6.01" y2="18"/>
                        </svg>
                    </div>

                    <div style={S.badge}>Coming Soon</div>
                    <h2 style={S.heroTitle}>Custom service connections are in progress</h2>
                    <p style={S.heroDesc}>
                        Soon you'll be able to securely plug in your own infrastructure —
                        databases, internal APIs, and private networks — and access them
                        directly inside your workflows.
                    </p>

                    <div style={S.featureGrid} className="m-feature-grid">
                        {planned.map(f => (
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
                            <button className="g-btn-primary" onClick={handleNotify}>Notify me</button>
                        </div>
                    ) : (
                        <div style={S.successRow}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style={S.successText}>You're on the list — we'll ping you when it's ready.</span>
                        </div>
                    )}
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
    subtitle: { fontSize: 15, color: "#888", margin: 0, maxWidth: 500 },

    heroCard: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        padding: "48px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    },
    iconWrap: {
        width: 56,
        height: 56,
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
        fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
        fontWeight: 700,
        letterSpacing: "-0.03em",
        color: "#111",
        margin: "0 0 12px",
        maxWidth: 460,
    },
    heroDesc: {
        fontSize: 14,
        color: "#666",
        lineHeight: 1.65,
        margin: "0 0 32px",
        maxWidth: 460,
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
    featureIcon: { fontSize: 18, lineHeight: 1, marginTop: 1, flexShrink: 0 },
    featureLabel: { fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 2 },
    featureDesc: { fontSize: 12, color: "#888", lineHeight: 1.5 },

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
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: 8,
    },
    successText: { fontSize: 13, color: "#15803d", fontWeight: 500 },
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
    .m-feature-grid { grid-template-columns: 1fr !important; }
  }
`;
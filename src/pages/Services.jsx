import { useState, useEffect } from "react";

export default function Services() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }} className="m-header-row">
                        <div>
                            <h1 style={S.h1}>Connected Services</h1>
                            <p style={S.subtitle}>Manage your databases, internal APIs, and custom service connections.</p>
                        </div>
                        <button className="s-btn-primary">+ Add Service</button>
                    </div>
                </div>

                <div style={S.emptyState}>
                    <div style={S.emptyIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                            <line x1="6" y1="6" x2="6.01" y2="6"/>
                            <line x1="6" y1="18" x2="6.01" y2="18"/>
                        </svg>
                    </div>
                    <div style={S.emptyTitle}>No services connected</div>
                    <p style={S.emptyText}>Connect your own infrastructure to securely access it within your workflows.</p>
                    <button className="s-btn-secondary">View Documentation</button>
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
        maxWidth: 500,
    },
    emptyState: {
        background: "#fff",
        border: "1px dashed #d5d5d5",
        borderRadius: 12,
        padding: "64px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginTop: 20,
    },
    emptyIcon: {
        width: 48,
        height: 48,
        background: "#fafafa",
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#111",
        letterSpacing: "-0.02em",
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#888",
        marginBottom: 24,
        maxWidth: 340,
        lineHeight: 1.5,
    },
};

const CSS = `
  .s-btn-primary {
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
  }
  .s-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .s-btn-secondary {
    display: inline-flex;
    align-items: center;
    padding: 10px 18px;
    background: transparent;
    color: #555;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    font-family: 'Geist', 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .s-btn-secondary:hover { background: #fafafa; border-color: #ccc; color: #111; }
  @media (max-width: 768px) {
    .m-page { padding: 90px 20px 60px !important; }
    .m-header-row { flex-direction: column; gap: 16px; align-items: stretch !important; }
    .m-header-row button { width: 100%; justify-content: center; }
  }
`;

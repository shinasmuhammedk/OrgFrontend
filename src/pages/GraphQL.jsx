import { useState, useEffect } from "react";

export default function GraphQL() {
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
            }}>
                <div style={S.header}>
                    <div style={S.sectionLabel}>API</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <h1 style={S.h1}>GraphQL API</h1>
                            <p style={S.subtitle}>Access your workflow data and trigger runs programmatically.</p>
                        </div>
                        <button className="g-btn-primary">Generate API Key</button>
                    </div>
                </div>

                <div style={S.card}>
                    <div style={S.cardHeader}>
                        <h3 style={S.cardTitle}>Endpoint</h3>
                    </div>
                    <div style={S.endpointRow}>
                        <span style={S.methodBadge}>POST</span>
                        <code style={S.codeBlock}>https://api.org.com/graphql</code>
                        <button className="g-btn-icon" title="Copy to clipboard">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div style={S.card}>
                    <div style={S.cardHeader}>
                        <h3 style={S.cardTitle}>Query Example</h3>
                    </div>
                    <div style={S.editorMock}>
                        <div style={S.editorTop}>
                            <div style={S.editorDots}>
                                <span style={{...S.dot, background: "#ff5f57"}} />
                                <span style={{...S.dot, background: "#febc2e"}} />
                                <span style={{...S.dot, background: "#28c840"}} />
                            </div>
                            <span style={S.editorTitle}>query.graphql</span>
                        </div>
                        <pre style={S.pre}>
<span style={{color: "#c678dd"}}>query</span> <span style={{color: "#61afef"}}>GetWorkflows</span> {'{\n'}
  workflows(first: 10) {'{\n'}
    edges {'{\n'}
      node {'{\n'}
        id\n        name\n        isActive\n        createdAt\n      {'}\n'}
    {'}\n'}
  {'}\n'}
{'}'}
                        </pre>
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
    card: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: "24px",
        marginBottom: 20,
    },
    cardHeader: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 600,
        color: "#111",
        margin: 0,
        letterSpacing: "-0.01em",
    },
    endpointRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#fafafa",
        border: "1px solid #e8e8e8",
        borderRadius: 8,
        padding: "8px 12px",
    },
    methodBadge: {
        background: "#f0fdf4",
        color: "#16a34a",
        border: "1px solid #bbf7d0",
        padding: "4px 8px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "'Geist Mono', monospace",
    },
    codeBlock: {
        fontFamily: "'Geist Mono', monospace",
        fontSize: 13,
        color: "#111",
        flex: 1,
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
    dot: { width: 10, height: 10, borderRadius: "50%" },
    editorTitle: {
        fontSize: 12,
        color: "#888",
        fontFamily: "'Geist Mono', monospace",
    },
    pre: {
        margin: 0,
        padding: "20px",
        fontFamily: "'Geist Mono', monospace",
        fontSize: 13,
        lineHeight: 1.6,
        color: "#abb2bf",
        overflowX: "auto",
    }
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
  }
  .g-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .g-btn-icon {
    background: transparent;
    border: none;
    color: #aaa;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.15s, color 0.15s;
  }
  .g-btn-icon:hover {
    background: #e5e5e5;
    color: #111;
  }
`;

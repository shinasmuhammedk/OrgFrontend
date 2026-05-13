// src/Toast.jsx — Redesigned Toast Notification
import { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    const isSuccess = type === "success";
    const isError = type === "error";
    const isWarning = type === "warning";
    const isInfo = type === "info" || (!isSuccess && !isError && !isWarning);

    const config = {
        success: {
            color: "#c8ff44",
            bg: "rgba(200,255,68,0.08)",
            border: "rgba(200,255,68,0.25)",
            glow: "rgba(200,255,68,0.15)",
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            ),
        },
        error: {
            color: "#ff4775",
            bg: "rgba(255,71,117,0.08)",
            border: "rgba(255,71,117,0.25)",
            glow: "rgba(255,71,117,0.15)",
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            ),
        },
        warning: {
            color: "#fb923c",
            bg: "rgba(251,146,60,0.08)",
            border: "rgba(251,146,60,0.25)",
            glow: "rgba(251,146,60,0.15)",
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            ),
        },
        info: {
            color: "#22d3ee",
            bg: "rgba(34,211,238,0.08)",
            border: "rgba(34,211,238,0.25)",
            glow: "rgba(34,211,238,0.15)",
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            ),
        },
    };

    const c = config[isSuccess ? "success" : isError ? "error" : isWarning ? "warning" : "info"];

    return (
        <>
            <style>{`
                @keyframes toastSlideIn {
                    from { opacity: 0; transform: translateX(40px) scale(0.95); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                @keyframes toastProgress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                @keyframes iconPop {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
            <div
                style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    zIndex: 9999,
                    animation: "toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
            >
                <div
                    style={{
                        minWidth: 280,
                        maxWidth: 400,
                        background: "rgba(12,12,20,0.95)",
                        backdropFilter: "blur(24px) saturate(180%)",
                        WebkitBackdropFilter: "blur(24px) saturate(180%)",
                        border: `1px solid ${c.border}`,
                        borderRadius: 14,
                        overflow: "hidden",
                        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    }}
                >
                    {/* Progress bar */}
                    <div
                        style={{
                            height: 2,
                            background: c.color,
                            opacity: 0.6,
                            animation: "toastProgress 4s linear forwards",
                        }}
                    />

                    <div
                        style={{
                            padding: "16px 18px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                        }}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 10,
                                background: c.bg,
                                border: `1px solid ${c.border}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: c.color,
                                flexShrink: 0,
                                animation: "iconPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
                            }}
                        >
                            {c.icon}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#f0f0f5",
                                    lineHeight: 1.5,
                                    wordBreak: "break-word",
                                }}
                            >
                                {message}
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "#4a4a6a",
                                    marginTop: 4,
                                    fontWeight: 500,
                                }}
                            >
                                {isSuccess ? "Action completed successfully" : isError ? "Something went wrong" : isWarning ? "Please review this" : "For your information"}
                            </div>
                        </div>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                background: "rgba(255,255,255,0.04)",
                                border: "none",
                                color: "#4a4a6a",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "all 0.2s",
                                padding: 0,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.color = "#f0f0f5";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                e.currentTarget.style.color = "#4a4a6a";
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Toast;
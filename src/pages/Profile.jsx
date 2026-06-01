import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);
    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = () => {
        setLoading(true);
        setError("");
        Promise.all([
            api.get("/me"),
            api.get("/billing/usage"),
        ])
            .then(([profileRes, usageRes]) => {
                setProfile(profileRes.data || profileRes);
                setUsage(usageRes.data || usageRes);
                setLoading(false);
            })
            .catch((err) => {
                console.error("PROFILE ERROR:", err);
                setError("Failed to load profile");
                setLoading(false);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getInitials = (email) => {
        if (!email) return "U";
        return email.split("@")[0].slice(0, 2).toUpperCase();
    };

    const runs = usage?.workflow_runs || 0;
    const limit = 100;
    const percent = Math.min((runs / limit) * 100, 100);

    if (loading) {
        return (
            <div style={S.root}>
                <style>{CSS}</style>
                <div style={S.gridBg} aria-hidden />
                <div style={S.page}>
                    <div style={S.skeletonHeader}>
                        <div className="p-skeleton" style={{ width: 72, height: 72, borderRadius: 16 }} />
                        <div>
                            <div className="p-skeleton" style={{ width: 200, height: 28, borderRadius: 8, marginBottom: 10 }} />
                            <div className="p-skeleton" style={{ width: 260, height: 16, borderRadius: 6 }} />
                        </div>
                    </div>
                    <div style={S.grid}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="p-skeleton" style={{ height: 200, borderRadius: 12 }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={S.root}>
                <style>{CSS}</style>
                <div style={S.gridBg} aria-hidden />
                <div style={{ ...S.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", margin: 0 }}>{error}</h2>
                    <p style={{ fontSize: 14, color: "#888", margin: 0 }}>We couldn't load your profile data.</p>
                    <button className="p-btn-primary" onClick={fetchProfile}>Retry</button>
                </div>
            </div>
        );
    }

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
                {/* Section Label */}
                <div style={S.sectionLabel}>Profile</div>

                {/* Header */}
                <div style={S.header}>
                    <div style={S.avatar}>{getInitials(profile?.email)}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <h1 style={S.name}>{profile?.email?.split("@")[0] || "User"}</h1>
                            <span style={S.planBadge}>{profile?.plan || "free"}</span>
                            {profile?.is_verified && (
                                <span style={S.verifiedBadge}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Verified
                                </span>
                            )}
                        </div>
                        <p style={S.email}>{profile?.email}</p>
                    </div>
                    <button className="p-btn-outline" onClick={() => navigate("/settings")}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                        </svg>
                        Settings
                    </button>
                </div>

                {/* Grid */}
                <div style={S.grid}>
                    {/* Account Info */}
                    <div style={S.card}>
                        <div style={S.cardLabel}>Account Information</div>
                        <div style={S.infoList}>
                            <div style={S.infoRow}>
                                <span style={S.infoKey}>User ID</span>
                                <span style={S.infoValueMono}>{profile?.id}</span>
                            </div>
                            <div style={S.infoRow}>
                                <span style={S.infoKey}>Email</span>
                                <span style={S.infoValue}>{profile?.email}</span>
                            </div>
                            <div style={S.infoRow}>
                                <span style={S.infoKey}>Status</span>
                                <span>
                                    <span style={{
                                        ...S.statusPill,
                                        background: profile?.is_verified ? "#f0fdf4" : "#fef2f2",
                                        color: profile?.is_verified ? "#16a34a" : "#ef4444",
                                        border: `1px solid ${profile?.is_verified ? "#bbf7d0" : "#fecaca"}`
                                    }}>
                                        {profile?.is_verified ? "Verified" : "Unverified"}
                                    </span>
                                </span>
                            </div>
                            <div style={S.infoRow}>
                                <span style={S.infoKey}>Joined</span>
                                <span style={S.infoValue}>
                                    {profile?.created_at
                                        ? new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Subscription */}
                    <div style={S.card}>
                        <div style={S.cardLabel}>Subscription</div>
                        <div style={S.subTier}>
                            <div style={S.subIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                            </div>
                            <div>
                                <div style={S.subPlan}>{profile?.plan || "Free"}</div>
                                <div style={S.subStatus}>Active</div>
                            </div>
                        </div>

                        <div style={S.subFeatures}>
                            {[
                                `${profile?.plan === "pro" ? "Unlimited" : "100"} workflow runs`,
                                `${profile?.plan === "pro" ? "Priority" : "Community"} support`
                            ].map((f, i) => (
                                <div key={i} style={S.subFeature}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>

                        <button className="p-btn-secondary" onClick={() => navigate("/billing")}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                            Manage Billing
                        </button>
                    </div>

                    {/* Usage */}
                    <div style={S.card}>
                        <div style={S.cardLabel}>Usage</div>
                        <div style={S.usageHeader}>
                            <div style={S.usageFraction}>
                                <span style={S.usageCurrent}>{runs}</span>
                                <span style={S.usageSep}>/</span>
                                <span style={S.usageLimit}>{limit}</span>
                                <span style={S.usageUnit}>runs</span>
                            </div>
                            <div style={S.usageMonth}>{usage?.month || "—"}</div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <div style={S.progressTrack}>
                                <div style={{
                                    ...S.progressFill,
                                    width: `${percent}%`,
                                    background: percent > 90 ? "#ef4444" : percent > 70 ? "#f59e0b" : "#111",
                                }} />
                            </div>
                            <div style={S.progressLabels}>
                                <span style={{ color: percent > 90 ? "#ef4444" : "#888" }}>{percent.toFixed(1)}% used</span>
                                <span style={S.resetText}>Resets monthly</span>
                            </div>
                        </div>

                        <div style={S.usageBreakdown}>
                            {[
                                { value: runs, label: "This period" },
                                { value: Math.max(0, limit - runs), label: "Remaining" },
                                { value: limit, label: "Limit" }
                            ].map((s, i) => (
                                <div key={i} style={S.usageStat}>
                                    <div style={S.statValue}>{s.value}</div>
                                    <div style={S.statLabel}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security */}
                    <div style={S.card}>
                        <div style={S.cardLabel}>Security</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={S.securityRow}>
                                <div style={{ ...S.securityIcon, background: "#f0fdf4", color: "#16a34a" }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={S.securityTitle}>Password</div>
                                    <div style={S.securityDesc}>Last changed recently</div>
                                </div>
                                <button className="p-btn-ghost-sm" onClick={() => navigate("/forgot-password")}>Change</button>
                            </div>

                            <div style={S.securityRow}>
                                <div style={{ ...S.securityIcon, background: "#faf5ff", color: "#a855f6" }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={S.securityTitle}>API Keys</div>
                                    <div style={S.securityDesc}>Manage access tokens</div>
                                </div>
                                <button className="p-btn-ghost-sm" onClick={() => navigate("/settings")}>Manage</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Session / Logout */}
                <div style={{ ...S.card, borderColor: "#fecaca", marginTop: 0 }}>
                    <div style={{ ...S.cardLabel, color: "#ef4444" }}>Session</div>
                    <div style={S.dangerContent}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4 }}>Log out</div>
                            <div style={{ fontSize: 13, color: "#888" }}>End your current session and return to the login screen.</div>
                        </div>
                        <button className="p-btn-danger" onClick={handleLogout}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;

const S = {
    root: {
        minHeight: "100vh", background: "#fafafa", color: "#111",
        fontFamily: "'Geist', 'Inter', sans-serif", position: "relative", overflowX: "hidden",
    },
    gridBg: {
        position: "fixed", inset: 0,
        backgroundImage: "linear-gradient(#e8e8e8 1px, transparent 1px), linear-gradient(90deg, #e8e8e8 1px, transparent 1px)",
        backgroundSize: "40px 40px", opacity: 0.35,
        maskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)",
        zIndex: 0, pointerEvents: "none",
    },
    page: {
        position: "relative", zIndex: 1, maxWidth: 1080,
        margin: "0 auto", padding: "120px 40px 80px",
    },
    sectionLabel: {
        fontSize: 11, fontWeight: 600, textTransform: "uppercase",
        letterSpacing: "0.08em", color: "#aaa", marginBottom: 14,
        fontFamily: "'Geist Mono', monospace",
    },
    header: {
        display: "flex", alignItems: "center", gap: 20, marginBottom: 32, flexWrap: "wrap",
    },
    avatar: {
        width: 72, height: 72, borderRadius: 16,
        background: "linear-gradient(135deg, #a855f6, #06b6d4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, fontWeight: 700, color: "#fff",
        fontFamily: "'Geist Mono', monospace", flexShrink: 0,
        boxShadow: "0 8px 24px rgba(168,85,246,0.2)",
    },
    name: {
        fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em",
        color: "#111", margin: 0,
    },
    email: { fontSize: 14, color: "#888", margin: "6px 0 0" },
    planBadge: {
        fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 600,
        padding: "4px 10px", borderRadius: 6, textTransform: "uppercase",
        letterSpacing: "0.04em", background: "#f5f5f5", color: "#888",
        border: "1px solid #e5e5e5",
    },
    verifiedBadge: {
        display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
        color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0",
        padding: "4px 10px", borderRadius: 6,
    },
    grid: {
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 20, marginBottom: 20,
    },
    card: {
        background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12,
        padding: 24, display: "flex", flexDirection: "column",
        transition: "border-color 0.15s, box-shadow 0.15s",
    },
    cardLabel: {
        fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 600,
        color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20,
    },
    infoList: { display: "flex", flexDirection: "column", gap: 16 },
    infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 },
    infoKey: { color: "#888" },
    infoValue: { color: "#111", fontWeight: 500, textAlign: "right" },
    infoValueMono: { fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#aaa", textAlign: "right" },
    statusPill: { padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "'Geist Mono', monospace" },
    subTier: { display: "flex", alignItems: "center", gap: 14, marginBottom: 20 },
    subIcon: {
        width: 44, height: 44, borderRadius: 12, background: "#f5f5f5",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#888", flexShrink: 0,
    },
    subPlan: { fontSize: 18, fontWeight: 700, textTransform: "capitalize", color: "#111" },
    subStatus: { fontSize: 12, color: "#888", marginTop: 2 },
    subFeatures: {
        display: "flex", flexDirection: "column", gap: 10, marginBottom: 20,
        paddingBottom: 20, borderBottom: "1px solid #f0f0f0",
    },
    subFeature: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#888" },
    usageHeader: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 },
    usageFraction: { display: "flex", alignItems: "baseline", gap: 4 },
    usageCurrent: { fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "'Geist Mono', monospace" },
    usageSep: { fontSize: 18, color: "#ccc", margin: "0 2px" },
    usageLimit: { fontSize: 18, fontWeight: 600, color: "#888", fontFamily: "'Geist Mono', monospace" },
    usageUnit: { fontSize: 13, color: "#aaa", marginLeft: 4 },
    usageMonth: { fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.04em" },
    progressTrack: { height: 6, background: "#f0f0f0", borderRadius: 999, overflow: "hidden", marginBottom: 8 },
    progressFill: { height: "100%", borderRadius: 999, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)" },
    progressLabels: { display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 500 },
    resetText: { color: "#aaa", fontFamily: "'Geist Mono', monospace", fontSize: 11 },
    usageBreakdown: {
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
        paddingTop: 16, borderTop: "1px solid #f0f0f0",
    },
    usageStat: { textAlign: "center" },
    statValue: { fontSize: 18, fontWeight: 700, color: "#111", fontFamily: "'Geist Mono', monospace" },
    statLabel: { fontSize: 11, color: "#aaa", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "'Geist Mono', monospace" },
    securityRow: { display: "flex", alignItems: "center", gap: 14 },
    securityIcon: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    securityTitle: { fontSize: 13, fontWeight: 600, color: "#111" },
    securityDesc: { fontSize: 12, color: "#aaa", marginTop: 2 },
    dangerContent: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" },
    skeletonHeader: { display: "flex", alignItems: "center", gap: 20, marginBottom: 32 },
};

const CSS = `
    .p-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: p-shimmer 1.5s ease-in-out infinite;
    }
    @keyframes p-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    .p-btn-primary {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 10px 18px; border-radius: 8px; background: #111; color: #fff;
        border: none; font-family: inherit; font-size: 13px; font-weight: 600;
        cursor: pointer; transition: all 0.15s;
    }
    .p-btn-primary:hover { background: #333; transform: translateY(-1px); }
    .p-btn-secondary {
        width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
        padding: 12px 20px; border-radius: 8px; background: #fafafa; color: #111;
        border: 1px solid #e5e5e5; font-family: inherit; font-size: 13px; font-weight: 600;
        cursor: pointer; transition: all 0.15s;
    }
    .p-btn-secondary:hover { background: #f0f0f0; border-color: #ccc; transform: translateY(-1px); }
    .p-btn-outline {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 9px 16px; border-radius: 8px; background: transparent; color: #555;
        border: 1px solid #e5e5e5; font-family: inherit; font-size: 13px; font-weight: 500;
        cursor: pointer; transition: all 0.15s; flex-shrink: 0;
    }
    .p-btn-outline:hover { background: #fafafa; border-color: #ccc; color: #111; }
    .p-btn-ghost-sm {
        padding: 6px 12px; border-radius: 6px; background: transparent; color: #888;
        border: 1px solid #e5e5e5; font-family: inherit; font-size: 12px; font-weight: 500;
        cursor: pointer; transition: all 0.15s; flex-shrink: 0;
    }
    .p-btn-ghost-sm:hover { background: #fafafa; color: #111; border-color: #ccc; }
    .p-btn-danger {
        display: flex; align-items: center; gap: 8px;
        padding: 10px 18px; border-radius: 8px; background: transparent;
        color: #ef4444; border: 1px solid #fecaca; font-family: inherit;
        font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
    }
    .p-btn-danger:hover { background: #fef2f2; border-color: #ef4444; transform: translateY(-1px); }
    @media (max-width: 768px) {
        .p-grid { grid-template-columns: 1fr !important; }
    }
`;
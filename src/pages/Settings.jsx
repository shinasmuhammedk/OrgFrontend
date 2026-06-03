import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Settings() {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("general");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Form state
    const [displayName, setDisplayName] = useState("");
    const [timezone, setTimezone] = useState("UTC");
    const [language, setLanguage] = useState("en");
    const [theme, setTheme] = useState("light");
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [webhookNotifs, setWebhookNotifs] = useState(false);
    const [weeklyDigest, setWeeklyDigest] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState("30");

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        api.get("/me").then((res) => {
            const u = res.data || res;
            setUser(u);
            setDisplayName(u.name || u.email?.split("@")[0] || "");
        }).catch(() => {});
    }, []);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 600);
    };

    const tabs = [
        { id: "general", label: "General", icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" },
        { id: "notifications", label: "Notifications", icon: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" },
        { id: "security", label: "Security", icon: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" },
        { id: "danger", label: "Danger Zone", icon: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" },
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
            }} className="s-page">
                {/* Header */}
                <div style={S.header}>
                    <div style={S.sectionLabel}>Account</div>
                    <h1 style={S.h1}>Settings</h1>
                    <p style={S.subtitle}>Manage your account preferences, notifications, and security.</p>
                </div>

                <div style={S.layout} className="settings-layout">
                    {/* Sidebar Tabs */}
                    <div style={S.sidebar}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
                                    <path d={tab.icon} />
                                </svg>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div style={S.content}>

                        {/* General Tab */}
                        {activeTab === "general" && (
                            <div>
                                <h2 style={S.sectionTitle}>General Settings</h2>
                                <p style={S.sectionDesc}>Basic account and workspace preferences.</p>

                                <div style={S.card}>
                                    <div style={S.fieldGroup}>
                                        <label style={S.fieldLabel}>Display Name</label>
                                        <input
                                            className="settings-input"
                                            value={displayName}
                                            onChange={e => setDisplayName(e.target.value)}
                                            placeholder="Your display name"
                                        />
                                    </div>

                                    <div style={S.fieldGroup}>
                                        <label style={S.fieldLabel}>Email</label>
                                        <input
                                            className="settings-input"
                                            value={user?.email || ""}
                                            disabled
                                            style={{ opacity: 0.6 }}
                                        />
                                        <span style={S.fieldHint}>Contact support to change your email address.</span>
                                    </div>

                                    <div style={S.fieldRow} className="s-field-row">
                                        <div style={{ flex: 1 }}>
                                            <label style={S.fieldLabel}>Timezone</label>
                                            <select
                                                className="settings-input settings-select"
                                                value={timezone}
                                                onChange={e => setTimezone(e.target.value)}
                                            >
                                                <option value="UTC">UTC</option>
                                                <option value="America/New_York">Eastern (US)</option>
                                                <option value="America/Los_Angeles">Pacific (US)</option>
                                                <option value="Europe/London">London</option>
                                                <option value="Asia/Kolkata">India (IST)</option>
                                                <option value="Asia/Tokyo">Japan (JST)</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={S.fieldLabel}>Language</label>
                                            <select
                                                className="settings-input settings-select"
                                                value={language}
                                                onChange={e => setLanguage(e.target.value)}
                                            >
                                                <option value="en">English</option>
                                                <option value="es">Spanish</option>
                                                <option value="fr">French</option>
                                                <option value="de">German</option>
                                                <option value="ja">Japanese</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ ...S.fieldRow, marginTop: 20 }} className="s-field-row">
                                        <div style={{ flex: 1 }}>
                                            <label style={S.fieldLabel}>Theme</label>
                                            <select
                                                className="settings-input settings-select"
                                                value={theme}
                                                onChange={e => setTheme(e.target.value)}
                                            >
                                                <option value="light">Light</option>
                                                <option value="dark">Dark</option>
                                                <option value="system">System</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}></div>
                                    </div>
                                </div>

                                <div style={S.saveRow}>
                                    {saved && <span style={S.savedText}>✓ Changes saved</span>}
                                    <button className="settings-btn-primary" onClick={handleSave} disabled={saving}>
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === "notifications" && (
                            <div>
                                <h2 style={S.sectionTitle}>Notification Preferences</h2>
                                <p style={S.sectionDesc}>Choose how and when you want to be notified.</p>

                                <div style={S.card}>
                                    <ToggleRow
                                        label="Email Notifications"
                                        desc="Receive alerts when workflows complete, fail, or need attention."
                                        checked={emailNotifs}
                                        onToggle={() => setEmailNotifs(!emailNotifs)}
                                    />
                                    <div style={S.toggleDivider} />
                                    <ToggleRow
                                        label="Webhook Notifications"
                                        desc="Send workflow events to a custom webhook endpoint."
                                        checked={webhookNotifs}
                                        onToggle={() => setWebhookNotifs(!webhookNotifs)}
                                    />
                                    <div style={S.toggleDivider} />
                                    <ToggleRow
                                        label="Weekly Digest"
                                        desc="Get a summary of your workflow activity every Monday."
                                        checked={weeklyDigest}
                                        onToggle={() => setWeeklyDigest(!weeklyDigest)}
                                    />
                                </div>

                                <div style={S.saveRow}>
                                    {saved && <span style={S.savedText}>✓ Changes saved</span>}
                                    <button className="settings-btn-primary" onClick={handleSave} disabled={saving}>
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div>
                                <h2 style={S.sectionTitle}>Security</h2>
                                <p style={S.sectionDesc}>Manage your password, sessions, and two-factor authentication.</p>

                                <div style={S.card}>
                                    <div style={S.fieldGroup}>
                                        <label style={S.fieldLabel}>Change Password</label>
                                        <input
                                            className="settings-input"
                                            type="password"
                                            placeholder="Current password"
                                            style={{ marginBottom: 10 }}
                                        />
                                        <input
                                            className="settings-input"
                                            type="password"
                                            placeholder="New password"
                                            style={{ marginBottom: 10 }}
                                        />
                                        <input
                                            className="settings-input"
                                            type="password"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>

                                <div style={S.card}>
                                    <ToggleRow
                                        label="Two-Factor Authentication"
                                        desc="Add an extra layer of security to your account with TOTP."
                                        checked={twoFactor}
                                        onToggle={() => setTwoFactor(!twoFactor)}
                                    />
                                    <div style={S.toggleDivider} />
                                    <div style={S.fieldGroup}>
                                        <label style={S.fieldLabel}>Session Timeout</label>
                                        <select
                                            className="settings-input settings-select"
                                            value={sessionTimeout}
                                            onChange={e => setSessionTimeout(e.target.value)}
                                            style={{ maxWidth: 240 }}
                                        >
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="480">8 hours</option>
                                            <option value="1440">24 hours</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={S.saveRow}>
                                    {saved && <span style={S.savedText}>✓ Changes saved</span>}
                                    <button className="settings-btn-primary" onClick={handleSave} disabled={saving}>
                                        {saving ? "Saving..." : "Update Security"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Danger Zone Tab */}
                        {activeTab === "danger" && (
                            <div>
                                <h2 style={{ ...S.sectionTitle, color: "#ef4444" }}>Danger Zone</h2>
                                <p style={S.sectionDesc}>Irreversible actions that affect your account permanently.</p>

                                <div style={{ ...S.card, borderColor: "#fecaca" }}>
                                    <div style={S.dangerRow}>
                                        <div style={{ flex: 1 }}>
                                            <div style={S.dangerLabel}>Export Account Data</div>
                                            <div style={S.dangerDesc}>Download all your workflows, run history, and account data.</div>
                                        </div>
                                        <button className="settings-btn-outline">Export</button>
                                    </div>

                                    <div style={S.toggleDivider} />

                                    <div style={S.dangerRow}>
                                        <div style={{ flex: 1 }}>
                                            <div style={S.dangerLabel}>Delete All Workflows</div>
                                            <div style={S.dangerDesc}>Permanently remove all workflows from your workspace.</div>
                                        </div>
                                        <button className="settings-btn-danger">Delete All</button>
                                    </div>

                                    <div style={S.toggleDivider} />

                                    <div style={S.dangerRow}>
                                        <div style={{ flex: 1 }}>
                                            <div style={S.dangerLabel}>Delete Account</div>
                                            <div style={S.dangerDesc}>Permanently delete your account and all associated data. This cannot be undone.</div>
                                        </div>
                                        <button className="settings-btn-danger">Delete Account</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToggleRow({ label, desc, checked, onToggle }) {
    return (
        <div style={S.toggleRow}>
            <div style={{ flex: 1 }}>
                <div style={S.toggleLabel}>{label}</div>
                <div style={S.toggleDesc}>{desc}</div>
            </div>
            <div
                className={`settings-toggle ${checked ? "on" : ""}`}
                onClick={onToggle}
            >
                <div className="settings-toggle-knob" />
            </div>
        </div>
    );
}

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
        position: "relative", zIndex: 1, maxWidth: 1000,
        margin: "0 auto", padding: "120px 40px 80px",
    },
    header: { marginBottom: 40 },
    sectionLabel: {
        fontSize: 11, fontWeight: 600, textTransform: "uppercase",
        letterSpacing: "0.08em", color: "#aaa", marginBottom: 14,
        fontFamily: "'Geist Mono', monospace",
    },
    h1: {
        fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700,
        letterSpacing: "-0.04em", color: "#111", margin: "0 0 8px", lineHeight: 1.1,
    },
    subtitle: { fontSize: 15, color: "#888", margin: 0 },
    layout: {
        display: "flex", gap: 32, alignItems: "flex-start",
    },
    sidebar: {
        width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4,
        position: "sticky", top: 100,
    },
    content: { flex: 1, minWidth: 0 },
    sectionTitle: {
        fontSize: 18, fontWeight: 700, color: "#111",
        letterSpacing: "-0.02em", marginBottom: 6,
    },
    sectionDesc: { fontSize: 14, color: "#888", marginBottom: 24 },
    card: {
        background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12,
        padding: "24px", marginBottom: 20,
    },
    fieldGroup: { marginBottom: 20 },
    fieldLabel: {
        display: "block", fontSize: 12, fontWeight: 600, color: "#555",
        marginBottom: 8,
    },
    fieldHint: { display: "block", fontSize: 11, color: "#aaa", marginTop: 6 },
    fieldRow: { display: "flex", gap: 16 },
    saveRow: {
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        gap: 12, marginTop: 4,
    },
    savedText: {
        fontSize: 13, color: "#16a34a", fontWeight: 500,
    },
    toggleRow: {
        display: "flex", alignItems: "center", gap: 16, padding: "4px 0",
    },
    toggleLabel: { fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4 },
    toggleDesc: { fontSize: 13, color: "#888", lineHeight: 1.5 },
    toggleDivider: { height: 1, background: "#f0f0f0", margin: "16px 0" },
    dangerRow: {
        display: "flex", alignItems: "center", gap: 16, padding: "4px 0",
    },
    dangerLabel: { fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4 },
    dangerDesc: { fontSize: 13, color: "#888", lineHeight: 1.5 },
};

const CSS = `
    .settings-tab {
        display: flex; align-items: center; gap: 10; padding: 10px 14px;
        border-radius: 8px; border: none; background: transparent;
        color: #888; font-size: 13px; font-weight: 500; cursor: pointer;
        font-family: inherit; transition: all 0.15s; text-align: left; width: 100%;
    }
    .settings-tab:hover { background: #f0f0f0; color: #111; }
    .settings-tab.active { background: #fff; color: #111; font-weight: 600; border: 1px solid #e5e5e5; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
    .settings-input {
        width: 100%; background: #fafafa; border: 1px solid #e5e5e5;
        border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #111;
        font-family: inherit; outline: none; transition: border-color 0.15s, background 0.15s;
        box-sizing: border-box;
    }
    .settings-input::placeholder { color: #aaa; }
    .settings-input:focus { background: #fff; border-color: #111; }
    .settings-input:disabled { opacity: 0.5; cursor: not-allowed; }
    .settings-select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 12px center;
        padding-right: 32px;
    }
    .settings-select option { background: #fff; color: #111; }
    .settings-btn-primary {
        padding: 10px 20px; background: #111; color: #fff; border: none;
        border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
        font-family: inherit; transition: all 0.15s;
    }
    .settings-btn-primary:hover:not(:disabled) { background: #333; transform: translateY(-1px); }
    .settings-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .settings-btn-outline {
        padding: 8px 16px; background: transparent; color: #111; border: 1px solid #e5e5e5;
        border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
        font-family: inherit; transition: all 0.15s; white-space: nowrap;
    }
    .settings-btn-outline:hover { background: #fafafa; border-color: #ccc; }
    .settings-btn-danger {
        padding: 8px 16px; background: transparent; color: #ef4444; border: 1px solid #fecaca;
        border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
        font-family: inherit; transition: all 0.15s; white-space: nowrap;
    }
    .settings-btn-danger:hover { background: #fef2f2; border-color: #ef4444; }
    .settings-toggle {
        width: 44px; height: 24px; border-radius: 12px; background: #e5e5e5;
        cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0;
    }
    .settings-toggle.on { background: #111; }
    .settings-toggle-knob {
        width: 18px; height: 18px; border-radius: 50%; background: #fff;
        position: absolute; top: 3px; left: 3px; transition: transform 0.2s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
    .settings-toggle.on .settings-toggle-knob { transform: translateX(20px); }

    @media (max-width: 768px) {
        .settings-layout { flex-direction: column !important; }
        .s-page { padding: 90px 20px 60px !important; }
        .s-field-row { flex-direction: column !important; gap: 12px !important; }
    }
`;

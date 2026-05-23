import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        setLoading(true);
        setError("");

        Promise.all([
            api.get("/me"),
            api.get("/billing/usage"),
        ])
            .then(([profileRes, usageRes]) => {
                const profileData = profileRes.data || profileRes;
                const usageData = usageRes.data || usageRes;

                setProfile(profileData);
                setUsage(usageData);
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

    const handleManageBilling = () => {
        navigate("/billing");
    };

    const getInitials = (email) => {
        if (!email) return "U";
        return email.split("@")[0].slice(0, 2).toUpperCase();
    };

    const getPlanColor = (plan) => {
        if (plan === "pro" || plan === "enterprise") return "#c8ff44";
        return "#8b8ba7";
    };

    const runs = usage?.workflow_runs || 0;
    const limit = 100;
    const percent = Math.min((runs / limit) * 100, 100);

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-header-skeleton">
                    <div className="skeleton-avatar" />
                    <div>
                        <div className="skeleton-title" />
                        <div className="skeleton-subtitle" />
                    </div>
                </div>
                <div className="profile-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="profile-card skeleton-card" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="error-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff5c7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <h2>{error}</h2>
                    <p>We couldn't load your profile data. Please try again.</p>
                    <button className="btn-primary" onClick={fetchProfile}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                        </svg>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* Header */}
            <div className="profile-header">
                <div className="avatar-large">
                    {getInitials(profile?.email)}
                </div>
                <div className="header-info">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <h1 className="profile-name">{profile?.email?.split("@")[0] || "User"}</h1>
                        <span
                            className="plan-badge"
                            style={{
                                color: getPlanColor(profile?.plan),
                                borderColor: `${getPlanColor(profile?.plan)}30`,
                                background: `${getPlanColor(profile?.plan)}10`,
                            }}
                        >
                            {profile?.plan || "free"}
                        </span>
                        {profile?.is_verified && (
                            <span className="verified-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c8ff44" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Verified
                            </span>
                        )}
                    </div>
                    <p className="profile-email">{profile?.email}</p>
                </div>
            </div>

            {/* Grid */}
            <div className="profile-grid">
                {/* Account Info */}
                <div className="profile-card">
                    <div className="card-label">Account Information</div>
                    <div className="info-list">
                        <div className="info-row">
                            <span className="info-key">User ID</span>
                            <span className="info-value mono">{profile?.id}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-key">Email</span>
                            <span className="info-value">{profile?.email}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-key">Status</span>
                            <span className="info-value">
                                <span
                                    className="status-pill"
                                    style={{
                                        background: profile?.is_verified ? "rgba(200,255,68,0.1)" : "rgba(255,92,122,0.1)",
                                        color: profile?.is_verified ? "#c8ff44" : "#ff5c7a",
                                        border: `1px solid ${profile?.is_verified ? "rgba(200,255,68,0.2)" : "rgba(255,92,122,0.2)"}`,
                                    }}
                                >
                                    {profile?.is_verified ? "Verified" : "Unverified"}
                                </span>
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-key">Joined</span>
                            <span className="info-value">
                                {profile?.created_at
                                    ? new Date(profile.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "—"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subscription */}
                <div className="profile-card">
                    <div className="card-label">Subscription</div>
                    <div className="sub-tier">
                        <div
                            className="sub-icon"
                            style={{
                                background: `${getPlanColor(profile?.plan)}15`,
                                color: getPlanColor(profile?.plan),
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                        </div>
                        <div>
                            <div className="sub-plan">{profile?.plan || "Free"}</div>
                            <div className="sub-status">Active</div>
                        </div>
                    </div>

                    <div className="sub-features">
                        <div className="sub-feature">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8ff44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{profile?.plan === "pro" ? "Unlimited" : "100"} workflow runs</span>
                        </div>
                        <div className="sub-feature">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8ff44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{profile?.plan === "pro" ? "Priority" : "Community"} support</span>
                        </div>
                    </div>

                    <button className="btn-secondary" onClick={handleManageBilling}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Manage Billing
                    </button>
                </div>

                {/* Usage */}
                <div className="profile-card">
                    <div className="card-label">Usage</div>
                    <div className="usage-header">
                        <div className="usage-fraction">
                            <span className="usage-current">{runs}</span>
                            <span className="usage-separator">/</span>
                            <span className="usage-limit">{limit}</span>
                            <span className="usage-unit">runs</span>
                        </div>
                        <div className="usage-month">
                            {usage?.month || "—"}
                        </div>
                    </div>

                    <div className="progress-container">
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${percent}%`,
                                    background:
                                        percent > 90
                                            ? "#ff5c7a"
                                            : percent > 70
                                                ? "#a78bfa"
                                                : "#c8ff44",
                                }}
                            />
                        </div>
                        <div className="progress-labels">
                            <span style={{ color: percent > 90 ? "#ff5c7a" : "#5a5a7a" }}>
                                {percent.toFixed(1)}% used
                            </span>
                            <span className="reset-text">Resets monthly</span>
                        </div>
                    </div>

                    <div className="usage-breakdown">
                        <div className="usage-stat">
                            <div className="stat-value">{runs}</div>
                            <div className="stat-label">This period</div>
                        </div>
                        <div className="usage-stat">
                            <div className="stat-value">{Math.max(0, limit - runs)}</div>
                            <div className="stat-label">Remaining</div>
                        </div>
                        <div className="usage-stat">
                            <div className="stat-value">{limit}</div>
                            <div className="stat-label">Limit</div>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="profile-card">
                    <div className="card-label">Security</div>
                    <div className="security-info">
                        <div className="security-row">
                            <div
                                className="security-icon"
                                style={{ background: "rgba(200,255,68,0.1)", color: "#c8ff44" }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            </div>
                            <div className="security-text">
                                <div className="security-title">Password</div>
                                <div className="security-desc">Last changed recently</div>
                            </div>
                            <button className="btn-ghost-sm" onClick={() => navigate("/forgot-password")}>
                                Change
                            </button>
                        </div>

                        <div className="security-row">
                            <div
                                className="security-icon"
                                style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                                </svg>
                            </div>
                            <div className="security-text">
                                <div className="security-title">API Keys</div>
                                <div className="security-desc">Manage access tokens</div>
                            </div>
                            <button className="btn-ghost-sm" onClick={() => navigate("/settings/api-keys")}>
                                Manage
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="profile-card danger-card">
                <div className="card-label" style={{ color: "#ff5c7a" }}>Session</div>
                <div className="danger-content">
                    <div>
                        <div className="danger-title">Log out</div>
                        <div className="danger-desc">End your current session and return to the login screen.</div>
                    </div>
                    <button className="btn-danger" onClick={handleLogout}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>

            <style>{`
        .profile-page {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #f0f0f5;
          background: #0a0a0f;
          min-height: 100vh;
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
          animation: fadeUp 0.4s ease;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }

        .avatar-large {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          background: linear-gradient(135deg, #a78bfa, #22d3ee);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          font-family: 'DM Mono', monospace;
          flex-shrink: 0;
          box-shadow: 0 8px 32px rgba(167,139,250,0.2);
        }

        .header-info {
          flex: 1;
        }

        .profile-name {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
          color: #f0f0f5;
        }

        .profile-email {
          font-size: 14px;
          color: #8b8ba7;
          margin: 6px 0 0;
        }

        .plan-badge {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #c8ff44;
          background: rgba(200,255,68,0.08);
          border: 1px solid rgba(200,255,68,0.15);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .profile-card {
          background: #12121a;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .profile-card:hover {
          border-color: rgba(255,255,255,0.1);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }

        .danger-card {
          border-color: rgba(255,92,122,0.08);
          background: linear-gradient(145deg, #12121a 0%, rgba(255,92,122,0.02) 100%);
        }

        .danger-card:hover {
          border-color: rgba(255,92,122,0.15);
        }

        .card-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: #5a5a7a;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 20px;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .info-key {
          color: #8b8ba7;
        }

        .info-value {
          color: #f0f0f5;
          font-weight: 500;
          text-align: right;
        }

        .info-value.mono {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #5a5a7a;
        }

        .status-pill {
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          font-family: 'DM Mono', monospace;
        }

        .sub-tier {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .sub-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sub-plan {
          font-size: 18px;
          font-weight: 700;
          text-transform: capitalize;
          color: #f0f0f5;
        }

        .sub-status {
          font-size: 12px;
          color: #8b8ba7;
          margin-top: 2px;
        }

        .sub-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .sub-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #8b8ba7;
        }

        /* Usage Card Styles */
        .usage-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 16px;
        }

        .usage-fraction {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .usage-current {
          font-size: 28px;
          font-weight: 700;
          color: #f0f0f5;
          font-family: 'DM Mono', monospace;
        }

        .usage-separator {
          font-size: 18px;
          color: #5a5a7a;
          margin: 0 2px;
        }

        .usage-limit {
          font-size: 18px;
          font-weight: 600;
          color: #8b8ba7;
          font-family: 'DM Mono', monospace;
        }

        .usage-unit {
          font-size: 13px;
          color: #5a5a7a;
          margin-left: 4px;
        }

        .usage-month {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #5a5a7a;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .progress-container {
          margin-bottom: 20px;
        }

        .progress-track {
          height: 6px;
          background: #181824;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 10px currentColor;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 500;
        }

        .reset-text {
          color: #5a5a7a;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
        }

        .usage-breakdown {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .usage-stat {
          text-align: center;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #f0f0f5;
          font-family: 'DM Mono', monospace;
        }

        .stat-label {
          font-size: 11px;
          color: #5a5a7a;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-family: 'DM Mono', monospace;
        }

        .security-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .security-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .security-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .security-text {
          flex: 1;
        }

        .security-title {
          font-size: 13px;
          font-weight: 600;
          color: #f0f0f5;
        }

        .security-desc {
          font-size: 12px;
          color: #5a5a7a;
          margin-top: 2px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          background: #c8ff44;
          color: #0a0a0f;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: -0.01em;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(200,255,68,0.25);
        }

        .btn-secondary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 10px;
          background: #181824;
          color: #f0f0f5;
          border: 1px solid rgba(255,255,255,0.1);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #1e1e2e;
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }

        .btn-ghost-sm {
          padding: 6px 12px;
          border-radius: 6px;
          background: transparent;
          color: #8b8ba7;
          border: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .btn-ghost-sm:hover {
          background: #1e1e2e;
          color: #f0f0f5;
          border-color: rgba(255,255,255,0.1);
        }

        .btn-danger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          background: rgba(255,92,122,0.1);
          color: #ff5c7a;
          border: 1px solid rgba(255,92,122,0.2);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .btn-danger:hover {
          background: rgba(255,92,122,0.18);
          border-color: rgba(255,92,122,0.3);
          transform: translateY(-1px);
        }

        .danger-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .danger-title {
          font-size: 14px;
          font-weight: 600;
          color: #f0f0f5;
        }

        .danger-desc {
          font-size: 12px;
          color: #8b8ba7;
          margin-top: 4px;
        }

        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 16px;
          text-align: center;
        }

        .error-state h2 {
          font-size: 18px;
          font-weight: 600;
          color: #f0f0f5;
          margin: 0;
        }

        .error-state p {
          font-size: 14px;
          color: #8b8ba7;
          margin: 0;
        }

        /* Skeleton */
        .profile-header-skeleton {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }

        .skeleton-avatar {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          background: #181824;
          animation: shimmer 1.5s ease-in-out infinite;
          background-size: 200% 100%;
          flex-shrink: 0;
        }

        .skeleton-title {
          height: 32px;
          width: 200px;
          background: #181824;
          border-radius: 8px;
          animation: shimmer 1.5s ease-in-out infinite;
          background-size: 200% 100%;
        }

        .skeleton-subtitle {
          height: 16px;
          width: 260px;
          background: #181824;
          border-radius: 6px;
          margin-top: 10px;
          animation: shimmer 1.5s ease-in-out infinite;
          background-size: 200% 100%;
        }

        .skeleton-card {
          height: 200px;
          background: #181824;
          animation: shimmer 1.5s ease-in-out infinite;
          background-size: 200% 100%;
          border: none;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .profile-page {
            padding: 20px;
          }
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .danger-content {
            flex-direction: column;
            align-items: flex-start;
          }
          .usage-breakdown {
            grid-template-columns: 1fr;
            text-align: left;
          }
          .usage-stat {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>
        </div>
    );
}

export default Profile;
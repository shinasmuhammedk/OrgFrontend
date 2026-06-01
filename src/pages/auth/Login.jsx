import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const EyeOpen = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M1 7.5C1 7.5 3.5 3 7.5 3s6.5 4.5 6.5 4.5-2.5 4.5-6.5 4.5S1 7.5 1 7.5z" />
        <circle cx="7.5" cy="7.5" r="1.8" />
    </svg>
);

const EyeClosed = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M2 2l11 11M6.5 6.6A1.8 1.8 0 009.4 9.5M4.2 4.3C2.8 5.2 1.8 6.6 1 7.5c0 0 2.5 4.5 6.5 4.5 1.3 0 2.5-.4 3.5-1M6 3.1C6.5 3 7 3 7.5 3c4 0 6.5 4.5 6.5 4.5s-.6 1-1.7 2.1" />
    </svg>
);

const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.67 3.67 0 01-1.59 2.41v2h2.57c1.5-1.38 2.4-3.42 2.4-5.87z" fill="#4285F4" />
        <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.58-2a4.8 4.8 0 01-7.14-2.52H1v2.06A8 8 0 008 16z" fill="#34A853" />
        <path d="M3.58 9.54A4.8 4.8 0 013.34 8c0-.54.09-1.06.24-1.54V4.4H1A8 8 0 000 8c0 1.29.31 2.5.86 3.57l2.72-2.03z" fill="#FBBC05" />
        <path d="M8 3.2c1.22 0 2.3.42 3.16 1.24l2.37-2.37A8 8 0 001 4.4l2.72 2.06A4.8 4.8 0 018 3.2z" fill="#EA4335" />
    </svg>
);

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    const handleLogin = async () => {
        setError("");
        if (!email || !password) {
            setError("Email & password required");
            return;
        }
        setLoading(true);
        try {
            const data = await api.login(email, password);
            localStorage.setItem("token", data.data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div style={S.root}>
            <style>{CSS}</style>
            <div style={S.gridBg} aria-hidden />

            <div style={S.container}>
                <div style={S.card}>
                    {/* Logo */}
                    <div style={S.logoContainer}>
                        <div style={S.logo}>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <circle cx="6.5" cy="6.5" r="2" fill="#0a0a0f" />
                                <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2" stroke="#0a0a0f" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span style={S.logoText}>ORG</span>
                    </div>

                    <h1 style={S.h1}>Welcome back</h1>
                    <p style={S.subtitle}>Log in to your Org workspace.</p>

                    {error && (
                        <div style={S.errorBanner}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                                <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.2" />
                                <path d="M7 4v3.5M7 9.5v.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div style={S.formGroup}>
                        <label style={S.label}>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(""); }}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            autoComplete="email"
                            autoFocus
                            className="auth-input"
                        />
                    </div>

                    <div style={S.formGroup}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <label style={{ ...S.label, marginBottom: 0 }}>Password</label>
                            <span 
                                onClick={() => navigate("/forgot-password")}
                                className="auth-forgot"
                            >
                                Forgot password?
                            </span>
                        </div>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(""); }}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                autoComplete="current-password"
                                className="auth-input"
                                style={{ paddingRight: 40 }}
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowPassword(p => !p)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeClosed /> : <EyeOpen />}
                            </button>
                        </div>
                    </div>

                    <div style={S.rememberRow}>
                        <div
                            onClick={() => setRememberMe(!rememberMe)}
                            className={`auth-checkbox ${rememberMe ? "checked" : ""}`}
                        >
                            {rememberMe && (
                                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1.5 4.5l2 2 4-4" />
                                </svg>
                            )}
                        </div>
                        <span style={S.rememberText}>Remember me for 7 days</span>
                    </div>

                    <button className="auth-btn-primary" onClick={handleLogin} disabled={loading}>
                        {loading ? "Authenticating..." : "Log In"}
                    </button>

                    <div style={S.divider}>
                        <div style={S.dividerLine} />
                        <span style={S.dividerText}>OR</span>
                        <div style={S.dividerLine} />
                    </div>

                    <button
                        className="auth-btn-ghost"
                        onClick={() => window.location.href = "http://localhost:8080/auth/google/start"}
                        disabled={loading}
                    >
                        <GoogleIcon />
                        Continue with Google
                    </button>
                    
                    <p style={S.footerText}>
                        Don't have an account?{" "}
                        <Link to="/signup" className="auth-link">
                            Sign up →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const S = {
    root: {
        minHeight: "100vh", background: "#fafafa", color: "#111",
        fontFamily: "'Geist', 'Inter', sans-serif", position: "relative",
    },
    gridBg: {
        position: "fixed", inset: 0,
        backgroundImage: "linear-gradient(#e8e8e8 1px, transparent 1px), linear-gradient(90deg, #e8e8e8 1px, transparent 1px)",
        backgroundSize: "40px 40px", opacity: 0.35,
        maskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)",
        zIndex: 0, pointerEvents: "none",
    },
    container: {
        position: "relative", zIndex: 1, minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 20px",
    },
    card: {
        width: "100%", maxWidth: 400, background: "#fff",
        border: "1px solid #e5e5e5", borderRadius: 16,
        padding: "40px", boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
    },
    logoContainer: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 },
    logo: {
        width: 32, height: 32, background: "#c8ff44", borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    logoText: {
        fontFamily: "'Geist Mono', monospace", fontWeight: 700,
        fontSize: 15, letterSpacing: "0.22em", color: "#111",
    },
    h1: {
        fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em",
        color: "#111", marginBottom: 8, lineHeight: 1.2,
    },
    subtitle: { fontSize: 14, color: "#888", marginBottom: 32 },
    errorBanner: {
        background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
        padding: "10px 12px", marginBottom: 20, fontSize: 13, color: "#ef4444",
        display: "flex", alignItems: "flex-start", gap: 8,
    },
    formGroup: { marginBottom: 18 },
    label: {
        display: "block", fontSize: 12, fontWeight: 600, color: "#555",
        marginBottom: 8,
    },
    rememberRow: { display: "flex", alignItems: "center", gap: 8, margin: "20px 0 24px" },
    rememberText: { fontSize: 13, color: "#555" },
    divider: { display: "flex", alignItems: "center", gap: 12, margin: "24px 0" },
    dividerLine: { flex: 1, height: 1, background: "#e5e5e5" },
    dividerText: { fontSize: 11, color: "#aaa", fontFamily: "'Geist Mono', monospace" },
    footerText: { marginTop: 24, textAlign: "center", fontSize: 13, color: "#888" }
};

const CSS = `
    .auth-input {
        width: 100%; background: #fafafa; border: 1px solid #e5e5e5;
        border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #111;
        font-family: inherit; outline: none; transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
        box-sizing: border-box;
    }
    .auth-input::placeholder { color: #aaa; }
    .auth-input:focus { background: #fff; border-color: #111; box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }
    .auth-eye-btn {
        position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
        background: none; border: none; color: #aaa; cursor: pointer;
        padding: 4px; display: flex; align-items: center; justify-content: center;
        transition: color 0.15s;
    }
    .auth-eye-btn:hover { color: #111; }
    .auth-btn-primary {
        width: 100%; padding: 12px; background: #111; color: #fff;
        border: none; border-radius: 8px; font-size: 13px; font-weight: 600;
        cursor: pointer; transition: all 0.15s; font-family: inherit;
    }
    .auth-btn-primary:hover:not(:disabled) { background: #333; transform: translateY(-1px); }
    .auth-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .auth-btn-ghost {
        width: 100%; padding: 11px; background: transparent; border: 1px solid #e5e5e5;
        border-radius: 8px; font-size: 13px; font-weight: 500; color: #111;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        gap: 10px; transition: all 0.15s; font-family: inherit;
    }
    .auth-btn-ghost:hover:not(:disabled) { background: #fafafa; border-color: #ccc; }
    .auth-checkbox {
        width: 16px; height: 16px; border-radius: 4px; border: 1px solid #d0d0d0;
        background: #fff; display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.15s;
    }
    .auth-checkbox.checked { background: #111; border-color: #111; }
    .auth-forgot { font-size: 11px; color: #888; cursor: pointer; transition: color 0.15s; }
    .auth-forgot:hover { color: #111; }
    .auth-link { color: #111; font-weight: 600; text-decoration: none; }
    .auth-link:hover { text-decoration: underline; }
`;
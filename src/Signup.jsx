import { useState } from "react";
import api from "./service/api";
import { useNavigate, Link } from "react-router-dom";

// ─── Eye icon SVGs ────────────────────────────────────────────────────────────
const EyeOpen = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M1 7.5C1 7.5 3.5 3 7.5 3s6.5 4.5 6.5 4.5-2.5 4.5-6.5 4.5S1 7.5 1 7.5z"/>
    <circle cx="7.5" cy="7.5" r="1.8"/>
  </svg>
);

const EyeClosed = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M2 2l11 11M6.5 6.6A1.8 1.8 0 009.4 9.5M4.2 4.3C2.8 5.2 1.8 6.6 1 7.5c0 0 2.5 4.5 6.5 4.5 1.3 0 2.5-.4 3.5-1M6 3.1C6.5 3 7 3 7.5 3c4 0 6.5 4.5 6.5 4.5s-.6 1-1.7 2.1"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.67 3.67 0 01-1.59 2.41v2h2.57c1.5-1.38 2.4-3.42 2.4-5.87z" fill="#4285F4"/>
    <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.58-2a4.8 4.8 0 01-7.14-2.52H1v2.06A8 8 0 008 16z" fill="#34A853"/>
    <path d="M3.58 9.54A4.8 4.8 0 013.34 8c0-.54.09-1.06.24-1.54V4.4H1A8 8 0 000 8c0 1.29.31 2.5.86 3.57l2.72-2.03z" fill="#FBBC05"/>
    <path d="M8 3.2c1.22 0 2.3.42 3.16 1.24l2.37-2.37A8 8 0 001 4.4l2.72 2.06A4.8 4.8 0 018 3.2z" fill="#EA4335"/>
  </svg>
);

// ─── Shared CSS injected once ─────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Archivo:wght@300;400;500;600;700&display=swap');

  :root {
    --bg:    #09090e;
    --bg2:   #0f0f17;
    --bg3:   #16161f;
    --bg4:   #1c1c28;
    --line:  #252535;
    --line2: #2e2e42;
    --text:  #e4e4f0;
    --text2: #9898b8;
    --text3: #55556a;
    --lime:  #c8ff44;
    --lime2: #a8e030;
    --rose:  #ff3d6a;
    --amber: #ffaa22;
    --violet:#9d6fff;
    --mono:  'DM Mono', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Archivo', sans-serif;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @keyframes gridPan {
    from { background-position: 0 0; }
    to   { background-position: 40px 40px; }
  }

  @keyframes shimmer {
    0%   { opacity: .4; }
    50%  { opacity: .9; }
    100% { opacity: .4; }
  }

  .org-input {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--line2);
    border-radius: 7px;
    padding: 11px 14px;
    font-size: 13px;
    font-family: 'Archivo', sans-serif;
    color: var(--text);
    outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  .org-input::placeholder { color: var(--text3); }
  .org-input:focus {
    border-color: var(--lime);
    box-shadow: 0 0 0 3px rgba(200,255,68,.08);
  }
  .org-input:disabled { opacity: .5; cursor: not-allowed; }

  .org-btn-primary {
    width: 100%;
    padding: 12px;
    background: var(--lime);
    color: var(--bg);
    border: none;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 700;
    font-family: var(--mono);
    letter-spacing: .05em;
    cursor: pointer;
    transition: background .13s, opacity .13s;
  }
  .org-btn-primary:hover:not(:disabled) { background: var(--lime2); }
  .org-btn-primary:disabled { opacity: .5; cursor: not-allowed; }

  .org-btn-ghost {
    width: 100%;
    padding: 11px;
    background: none;
    color: var(--text2);
    border: 1px solid var(--line2);
    border-radius: 7px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Archivo', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    transition: border-color .13s, color .13s, background .13s;
  }
  .org-btn-ghost:hover { border-color: var(--text3); color: var(--text); background: var(--bg3); }

  .eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text3);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px;
    transition: color .12s;
  }
  .eye-btn:hover { color: var(--text2); }

  .field-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: var(--text3);
    letter-spacing: .06em;
    text-transform: uppercase;
    font-family: var(--mono);
    margin-bottom: 6px;
  }
`;

// ─── Background grid canvas ───────────────────────────────────────────────────
function GridBackground() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
      background: "var(--bg)",
    }}>
      {/* animated dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, #2a2a3a 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        animation: "gridPan 8s linear infinite",
        opacity: .6,
      }} />
      {/* lime glow top-left */}
      <div style={{
        position: "absolute", top: -120, left: -80,
        width: 420, height: 420,
        background: "radial-gradient(circle, rgba(200,255,68,.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* violet glow bottom-right */}
      <div style={{
        position: "absolute", bottom: -100, right: -60,
        width: 360, height: 360,
        background: "radial-gradient(circle, rgba(157,111,255,.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── Logo mark ────────────────────────────────────────────────────────────────
function OrgLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 32 }}>
      <div style={{
        width: 30, height: 30, background: "var(--lime)",
        clipPath: "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="2" fill="#09090e"/>
          <path d="M7 1v2M7 11v2M1 7h2M11 7h2"
            stroke="#09090e" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>
      <span style={{
        fontFamily: "var(--mono)", fontWeight: 500,
        fontSize: 18, letterSpacing: 3, color: "var(--lime)",
      }}>ORG</span>
    </div>
  );
}

// ─── Input field wrapper ──────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

// ─── Error / success banners ──────────────────────────────────────────────────
function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: "rgba(255,61,106,.08)", border: "1px solid rgba(255,61,106,.25)",
      borderRadius: 7, padding: "10px 14px", marginBottom: 20,
      fontSize: 12.5, color: "var(--rose)", lineHeight: 1.5,
      display: "flex", alignItems: "flex-start", gap: 8,
    }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
      {msg}
    </div>
  );
}

function SuccessBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: "rgba(200,255,68,.06)", border: "1px solid rgba(200,255,68,.2)",
      borderRadius: 7, padding: "10px 14px", marginBottom: 20,
      fontSize: 12.5, color: "var(--lime)", lineHeight: 1.5,
      display: "flex", alignItems: "flex-start", gap: 8,
    }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>✓</span>
      {msg}
    </div>
  );
}

// ─── Password strength indicator ──────────────────────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null;
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  const levels = [
    { label: "Weak",   color: "var(--rose)"  },
    { label: "Fair",   color: "var(--amber)" },
    { label: "Good",   color: "var(--amber)" },
    { label: "Strong", color: "var(--lime)"  },
  ];
  const lvl = levels[Math.max(0, score - 1)];

  return (
    <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 3, flex: 1 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score ? lvl.color : "var(--line2)",
            transition: "background .2s",
          }} />
        ))}
      </div>
      <span style={{ fontSize: 10, color: lvl.color, fontFamily: "var(--mono)", fontWeight: 500, flexShrink: 0 }}>
        {lvl.label}
      </span>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", flexShrink: 0 }}>OR</span>
      <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
    </div>
  );
}

// ─── Main Signup component ────────────────────────────────────────────────────
function Signup() {
  const navigate = useNavigate();

  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name,            setName]            = useState("");
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState("");
  const [loading,         setLoading]         = useState(false);
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);

  // ── original logic — untouched ────────────────────────────────────────────
  const handleSignup = async () => {
    setError("");
    setSuccess("");

    if (!email || !password || !name || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const data = await api.signup(email, password, name);

      const accessToken  = data.access_token  || data.token;
      const refreshToken = data.refresh_token;

      if (accessToken)  localStorage.setItem("access_token",  accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
      if (data.user)    localStorage.setItem("user", JSON.stringify(data.user));

      if (!accessToken) {
        setSuccess(data.message || "Signup successful. Please verify your email.");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
  };
  // ── end original logic ────────────────────────────────────────────────────

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <GridBackground />

      {/* ── Page layout ── */}
      <div style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
      }}>
        <div style={{
          width: "100%", maxWidth: 420,
          animation: "fadeUp .35s ease both",
        }}>

          {/* ── Card ── */}
          <div style={{
            background: "var(--bg2)",
            border: "1px solid var(--line2)",
            borderRadius: 14,
            padding: "36px 36px 32px",
            boxShadow: "0 24px 64px rgba(0,0,0,.5)",
          }}>
            <OrgLogo />

            {/* Heading */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{
                fontSize: 22, fontWeight: 700, letterSpacing: "-.4px",
                color: "var(--text)", marginBottom: 5,
              }}>
                Create your account
              </h1>
              <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.5 }}>
                Start automating in minutes. No credit card required.
              </p>
            </div>

            {/* Banners */}
            <ErrorBanner   msg={error}   />
            <SuccessBanner msg={success} />

            {/* Full Name */}
            <Field label="Full Name">
              <input
                className="org-input"
                type="text"
                placeholder="Arun Kumar"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete="name"
              />
            </Field>

            {/* Email */}
            <Field label="Email Address">
              <input
                className="org-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete="email"
              />
            </Field>

            {/* Password */}
            <Field label="Password">
              <div style={{ position: "relative" }}>
                <input
                  className="org-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  style={{ paddingRight: 42 }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </Field>

            {/* Confirm Password */}
            <Field label="Confirm Password">
              <div style={{ position: "relative" }}>
                <input
                  className="org-input"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  style={{ paddingRight: 42 }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirm(p => !p)}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              {/* Match indicator */}
              {confirmPassword && (
                <div style={{
                  marginTop: 6, fontSize: 11,
                  color: confirmPassword === password ? "var(--lime)" : "var(--rose)",
                  fontFamily: "var(--mono)",
                }}>
                  {confirmPassword === password ? "✓ Passwords match" : "✗ Passwords do not match"}
                </div>
              )}
            </Field>

            {/* Submit */}
            <button
              className="org-btn-primary"
              onClick={handleSignup}
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{
                    width: 14, height: 14, border: "2px solid rgba(9,9,14,.3)",
                    borderTopColor: "var(--bg)", borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin .7s linear infinite",
                  }} />
                  CREATING ACCOUNT…
                </span>
              ) : "CREATE ACCOUNT →"}
            </button>

            <Divider />

            {/* Google OAuth */}
            <button
              type="button"
              className="org-btn-ghost"
              onClick={() => window.location.href = "http://localhost:8080/auth/google/start"}
              disabled={loading}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Terms */}
            <p style={{
              marginTop: 18, fontSize: 11, color: "var(--text3)",
              textAlign: "center", lineHeight: 1.6,
            }}>
              By creating an account you agree to our{" "}
              <span style={{ color: "var(--text2)", cursor: "pointer" }}>Terms of Service</span>
              {" "}and{" "}
              <span style={{ color: "var(--text2)", cursor: "pointer" }}>Privacy Policy</span>
            </p>
          </div>

          {/* Login link */}
          <p style={{
            marginTop: 20, textAlign: "center",
            fontSize: 13, color: "var(--text3)",
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{
              color: "var(--lime)", fontWeight: 600,
              textDecoration: "none", fontFamily: "var(--mono)",
            }}>
              LOG IN →
            </Link>
          </p>
        </div>
      </div>

      {/* spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

export default Signup;
import { useState } from "react";
import api from "./service/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email & password required");
      return;
    }

    setLoading(true);

    try {
      const data = await api.login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  // ORG Design tokens
  const colors = {
    ink: "#0d0e12",
    ink2: "#13141a",
    ink3: "#1a1b24",
    ink4: "#21222e",
    line: "#2c2d3d",
    line2: "#363749",
    chalk: "#dfe0f0",
    chalk2: "#9a9bb8",
    chalk3: "#5c5d7a",
    lime: "#b8ff57",
    lime2: "#95e63a",
    rose: "#ff4f7a",
  };

  const fonts = {
    mono: "'Space Mono', monospace",
    body: "'Bricolage Grotesque', sans-serif",
    mono2: "'IBM Plex Mono', monospace",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: fonts.body,
        color: colors.chalk,
        margin: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: colors.ink2,
          border: `1px solid ${colors.line}`,
          borderRadius: "12px",
          padding: "36px 32px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: colors.lime,
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="2" fill={colors.ink} />
              <path
                d="M7 1v2M7 11v2M1 7h2M11 7h2M3.22 3.22l1.41 1.41M9.37 9.37l1.41 1.41M3.22 10.78l1.41-1.41M9.37 4.63l1.41-1.41"
                stroke={colors.ink}
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: "17px",
              letterSpacing: "-0.5px",
              color: colors.lime,
            }}
          >
            ORG
          </span>
        </div>

        {/* Header */}
        <h1
          style={{
            fontFamily: fonts.mono,
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "-0.5px",
            marginBottom: "6px",
            color: colors.chalk,
          }}
        >
          Sign in_
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: colors.chalk3,
            marginBottom: "28px",
            lineHeight: 1.5,
          }}
        >
          Enter your credentials to access the workflow engine.
        </p>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "rgba(255,79,122,0.08)",
              border: `1px solid rgba(255,79,122,0.25)`,
              borderRadius: "6px",
              padding: "10px 12px",
              fontSize: "12px",
              color: colors.rose,
              marginBottom: "16px",
              fontFamily: fonts.mono2,
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Email Field */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              fontWeight: 700,
              color: colors.chalk3,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "6px",
              fontFamily: fonts.mono,
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              background: colors.ink,
              border: `1px solid ${colors.line}`,
              borderRadius: "6px",
              padding: "10px 12px",
              fontSize: "13px",
              color: colors.chalk,
              fontFamily: fonts.body,
              outline: "none",
              transition: "all 0.13s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.lime;
              e.target.style.boxShadow = `0 0 0 1px ${colors.lime}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.line;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              fontWeight: 700,
              color: colors.chalk3,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "6px",
              fontFamily: fonts.mono,
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                background: colors.ink,
                border: `1px solid ${colors.line}`,
                borderRadius: "6px",
                padding: "10px 38px 10px 12px",
                fontSize: "13px",
                color: colors.chalk,
                fontFamily: fonts.body,
                outline: "none",
                transition: "all 0.13s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.lime;
                e.target.style.boxShadow = `0 0 0 1px ${colors.lime}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.line;
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: colors.chalk3,
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                transition: "color 0.13s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.lime)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.chalk3)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: "6px",
            background: loading ? colors.ink4 : colors.lime,
            color: colors.ink,
            border: "none",
            fontFamily: fonts.mono,
            fontSize: "12.5px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.13s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (!loading && !e.target.disabled) {
              e.currentTarget.style.background = colors.lime2;
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && !e.target.disabled) {
              e.currentTarget.style.background = colors.lime;
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  border: `2px solid ${colors.ink}`,
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block",
                }}
              />
              Authenticating...
            </>
          ) : (
            "▶ Sign In"
          )}
        </button>

        {/* Footer */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "12px",
            color: colors.chalk3,
          }}
        >
          Don't have an account?{" "}
          <a
            href="/signup"
            style={{
              color: colors.lime,
              textDecoration: "none",
              fontWeight: 500,
              transition: "all 0.13s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = "underline";
              e.target.style.color = colors.lime2;
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = "none";
              e.target.style.color = colors.lime;
            }}
          >
            Create one
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export default Login;
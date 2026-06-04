import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// ─── Global styles (same design tokens as Signup/Dashboard) ──────────────────
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

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .4; }
  }

  @keyframes checkPop {
    0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
    60%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg);  opacity: 1; }
  }

  @keyframes countDown {
    from { width: 100%; }
    to   { width: 0%; }
  }
`;

// ─── Animated dot-grid background (same as Signup) ───────────────────────────
function GridBackground() {
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
            background: "var(--bg)",
        }}>
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

// ─── Logo mark (same as Signup) ───────────────────────────────────────────────
function OrgLogo() {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 9,
            marginBottom: 32, justifyContent: "center",
        }}>
            <div style={{
                width: 30, height: 30, background: "var(--lime)",
                clipPath: "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="2" fill="#09090e" />
                    <path d="M7 1v2M7 11v2M1 7h2M11 7h2"
                        stroke="#09090e" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
            </div>
            <span style={{
                fontFamily: "var(--mono)", fontWeight: 500,
                fontSize: 18, letterSpacing: 3, color: "var(--lime)",
            }}>ORG</span>
        </div>
    );
}

// ─── State: verifying (spinner) ───────────────────────────────────────────────
function VerifyingState() {
    return (
        <div style={{ textAlign: "center" }}>
            {/* spinning ring */}
            <div style={{
                width: 56, height: 56, borderRadius: "50%",
                border: "2px solid var(--line2)",
                borderTopColor: "var(--lime)",
                animation: "spin 1s linear infinite",
                margin: "0 auto 22px",
            }} />
            <h2 style={{
                fontSize: 18, fontWeight: 700, letterSpacing: "-.3px",
                color: "var(--text)", marginBottom: 8,
            }}>
                Verifying your email…
            </h2>
            <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6 }}>
                Hold on while we confirm your address.
                <br />This takes just a second.
            </p>
        </div>
    );
}

// ─── State: success ───────────────────────────────────────────────────────────
function SuccessState({ message, countdown }) {
    return (
        <div style={{ textAlign: "center" }}>
            {/* animated check circle */}
            <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(200,255,68,.1)",
                border: "1.5px solid rgba(200,255,68,.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 22px",
                animation: "checkPop .4s cubic-bezier(.34,1.56,.64,1) both",
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="var(--lime)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h2 style={{
                fontSize: 18, fontWeight: 700, letterSpacing: "-.3px",
                color: "var(--text)", marginBottom: 8,
            }}>
                Email verified!
            </h2>
            <p style={{
                fontSize: 13, color: "var(--text2)", lineHeight: 1.6,
                marginBottom: 24,
            }}>
                {message || "Your email has been confirmed successfully."}
            </p>

            {/* countdown bar */}
            <div style={{
                background: "var(--bg4)", border: "1px solid var(--line2)",
                borderRadius: 8, padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 10,
            }}>
                <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)", flexShrink: 0 }}>
                    Redirecting in {countdown}s
                </span>
                <div style={{ flex: 1, height: 2, background: "var(--line)", borderRadius: 1 }}>
                    <div style={{
                        height: 2, borderRadius: 1, background: "var(--lime)",
                        animation: "countDown 2s linear forwards",
                    }} />
                </div>
                <span style={{ fontSize: 11, color: "var(--lime)", flexShrink: 0 }}>→ Login</span>
            </div>
        </div>
    );
}

// ─── State: error ─────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
    return (
        <div style={{ textAlign: "center" }}>
            {/* error circle */}
            <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(255,61,106,.08)",
                border: "1.5px solid rgba(255,61,106,.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 22px",
                animation: "checkPop .4s cubic-bezier(.34,1.56,.64,1) both",
            }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                    stroke="var(--rose)" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 7v6M11 15v1" />
                    <circle cx="11" cy="11" r="9" />
                </svg>
            </div>

            <h2 style={{
                fontSize: 18, fontWeight: 700, letterSpacing: "-.3px",
                color: "var(--text)", marginBottom: 8,
            }}>
                Verification failed
            </h2>

            {/* error banner */}
            <div style={{
                background: "rgba(255,61,106,.07)", border: "1px solid rgba(255,61,106,.2)",
                borderRadius: 8, padding: "11px 14px", marginBottom: 22,
                fontSize: 12.5, color: "var(--rose)", lineHeight: 1.55,
                textAlign: "left", display: "flex", alignItems: "flex-start", gap: 8,
            }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
                {message || "Email verification failed. The link may have expired or is invalid."}
            </div>

            {/* helper tips */}
            <div style={{
                background: "var(--bg3)", border: "1px solid var(--line)",
                borderRadius: 8, padding: "12px 14px", marginBottom: 22,
                textAlign: "left",
            }}>
                <div style={{
                    fontSize: 10, fontWeight: 600, color: "var(--text3)",
                    fontFamily: "var(--mono)", letterSpacing: ".07em",
                    textTransform: "uppercase", marginBottom: 8,
                }}>
                    What to try
                </div>
                {[
                    "Check your email for the latest verification link",
                    "Verification links expire after 24 hours",
                    "Make sure you clicked the most recent link",
                ].map((tip, i) => (
                    <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 8,
                        fontSize: 12.5, color: "var(--text2)", lineHeight: 1.5,
                        marginBottom: i < 2 ? 6 : 0,
                    }}>
                        <span style={{ color: "var(--text3)", flexShrink: 0, marginTop: 2, fontSize: 11 }}>→</span>
                        {tip}
                    </div>
                ))}
            </div>

            {/* action buttons */}
            <button
                onClick={onRetry}
                style={{
                    width: "100%", padding: 12,
                    background: "var(--lime)", color: "var(--bg)",
                    border: "none", borderRadius: 7,
                    fontSize: 13, fontWeight: 700,
                    fontFamily: "var(--mono)", letterSpacing: ".05em",
                    cursor: "pointer", marginBottom: 10,
                    transition: "background .13s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--lime2)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--lime)"}
            >
                RESEND VERIFICATION EMAIL
            </button>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasVerified = useRef(false);

    // ── original state ─────────────────────────────────────────────────────────
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    // ── extra UI state ──────────────────────────────────────────────────────────
    const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
    const [countdown, setCountdown] = useState(2);

    // ── original logic — untouched ─────────────────────────────────────────────
    useEffect(() => {
        const verifyEmail = async () => {
            if (hasVerified.current) return;
            hasVerified.current = true;

            const token = searchParams.get("token");

            if (!token) {
                setError("Verification token missing");
                setMessage("");
                setStatus("error");
                return;
            }

            try {
                const API_URL = import.meta.env.VITE_API_URL;

                const res = await fetch(
                    `${API_URL}/verify-email?token=${token}`
                );
                const text = await res.text();

                let data = {};
                try {
                    data = text ? JSON.parse(text) : {};
                } catch {
                    data = { message: text };
                }

                if (!res.ok) {
                    throw new Error(data.message || data.error || "Email verification failed");
                }

                setError("");
                setMessage(data.message || "Email verified successfully");
                setStatus("success");

                // countdown tick
                let tick = 2;
                const interval = setInterval(() => {
                    tick -= 1;
                    setCountdown(tick);
                    if (tick <= 0) clearInterval(interval);
                }, 1000);

                setTimeout(() => {
                    navigate("/login");
                }, 2000);

            } catch (err) {
                setMessage("");
                setError(err.message || "Email verification failed");
                setStatus("error");
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);
    // ── end original logic ─────────────────────────────────────────────────────

    const handleResend = () => {
        // TODO: wire up resend endpoint
        navigate("/signup");
    };

    return (
        <>
            <style>{GLOBAL_CSS}</style>

            <GridBackground />

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

                    {/* Card */}
                    <div style={{
                        background: "var(--bg2)",
                        border: "1px solid var(--line2)",
                        borderRadius: 14,
                        padding: "36px 36px 32px",
                        boxShadow: "0 24px 64px rgba(0,0,0,.5)",
                    }}>
                        <OrgLogo />

                        {/* Dynamic state panels */}
                        {status === "verifying" && <VerifyingState />}
                        {status === "success" && <SuccessState message={message} countdown={countdown} />}
                        {status === "error" && <ErrorState message={error} onRetry={handleResend} />}
                    </div>

                    {/* Footer link */}
                    <p style={{
                        marginTop: 20, textAlign: "center",
                        fontSize: 13, color: "var(--text3)",
                    }}>
                        {status === "error" ? (
                            <>
                                Back to{" "}
                                <a href="/signup" style={{
                                    color: "var(--lime)", fontWeight: 600,
                                    textDecoration: "none", fontFamily: "var(--mono)",
                                }}>
                                    SIGN UP →
                                </a>
                            </>
                        ) : (
                            <>
                                Wrong account?{" "}
                                <a href="/signup" style={{
                                    color: "var(--lime)", fontWeight: 600,
                                    textDecoration: "none", fontFamily: "var(--mono)",
                                }}>
                                    SIGN UP →
                                </a>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </>
    );
}

export default VerifyEmail;
/* Shared design system extracted from Hero.jsx */
export const S = {
  root: {
    minHeight: "100vh",
    background: "rgb(250, 250, 250)",
    color: "#e8e6df",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    overflowX: "hidden",
  },
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%",
    height: 64,
    background: "rgba(250, 250, 250)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  logo: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.04em",
    color: "#f1f0eb",
  },
  navLinks: { display: "flex", gap: 28, alignItems: "center" },
  navLink: {
    color: "#9ca3af",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 450,
    transition: "color 0.2s",
  },
  navCta: {
    padding: "9px 22px",
    borderRadius: 8,
    background: "#f1f0eb",
    color: "#0a0a0f",
    fontWeight: 600,
    fontSize: 14,
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  heroSection: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "120px 5% 80px",
    textAlign: "center",
    overflow: "hidden",
  },
  heroInner: { position: "relative", zIndex: 2, maxWidth: 720 },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 16px",
    borderRadius: 100,
    border: "1px solid rgba(110,231,183,0.25)",
    background: "rgba(110,231,183,0.06)",
    color: "#6EE7B7",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 28,
    letterSpacing: "0.01em",
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#6EE7B7",
    display: "inline-block",
  },
  h1: {
    fontSize: "clamp(2.6rem, 6.5vw, 5rem)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    color: "#f1f0eb",
    margin: "0 0 24px",
  },
  gradText: {
    background: "linear-gradient(135deg, #6EE7B7 0%, #93C5FD 50%, #F9A8D4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subline: {
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
    lineHeight: 1.65,
    color: "#9ca3af",
    maxWidth: 580,
    margin: "0 auto 36px",
  },
  ctaRow: {
    display: "flex",
    gap: 14,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  socialProof: { color: "#6b7280", fontSize: 13, marginTop: 8 },
  // additional styles can be added as needed
};

export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  .cta-primary {
    display: inline-flex;
    align-items: center;
    padding: 14px 28px;
    border-radius: 10px;
    background: #f1f0eb;
    color: #0a0a0f;
    font-weight: 600;
    font-size: 15px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }
  .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(241,240,235,0.18); }
  .cta-ghost {
    display: inline-flex;
    align-items: center;
    padding: 14px 28px;
    border-radius: 10px;
    background: transparent;
    color: #d1d5db;
    font-size: 15px;
    font-weight: 600;
    border: 1px solid rgba(255,255,255,0.14);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .cta-ghost:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.22); transform: translateY(-1px); }
`;

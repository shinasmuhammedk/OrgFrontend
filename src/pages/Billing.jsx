import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function Billing() {
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const [subRes, usageRes] = await Promise.all([
        fetch(`${API_BASE_URL}/billing/subscription`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/billing/usage`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const subData = await subRes.json();
      const usageData = await usageRes.json();

      setSubscription(subData.data || subData);
      setUsage(usageData.data || usageData);
    } catch (err) {
      console.error("Billing fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setCheckoutLoading(true);
      const res = await fetch(`${API_BASE_URL}/billing/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: "pro" }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || data.error || "Failed to start checkout");
        return;
      }

      const checkoutUrl = data?.checkout_url || data?.url;
      if (!checkoutUrl) {
        alert("Checkout URL missing from backend response");
        return;
      }
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setPortalLoading(true);
      const res = await fetch(`${API_BASE_URL}/billing/portal`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || data.error || "Failed to open billing portal");
        return;
      }

      const portalUrl = data?.portal_url || data?.url;
      if (!portalUrl) {
        alert("Portal URL missing from backend response");
        return;
      }
      window.location.href = portalUrl;
    } catch (err) {
      console.error("Portal error:", err);
      alert("Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const plan = subscription?.plan || "free";
  const status = subscription?.status || "inactive";
  const runs = usage?.workflow_runs || 0;
  const limit = usage?.workflow_limit || 0;
  const percent = limit > 0 ? Math.min((runs / limit) * 100, 100) : 0;
  const isPro = plan === "pro" || plan === "enterprise";

  const getStatusColor = (s) => {
    if (s === "active" || s === "trialing") return "#22c55e";
    if (s === "past_due") return "#ef4444";
    return "#aaa";
  };

  if (loading) {
    return (
      <div style={S.root}>
        <style>{CSS}</style>
        <div style={S.page}>
          <div style={S.header}>
            <div className="b-skeleton" style={{ width: 120, height: 12, marginBottom: 20 }} />
            <div className="b-skeleton" style={{ width: 200, height: 32, marginBottom: 10 }} />
            <div className="b-skeleton" style={{ width: 320, height: 16 }} />
          </div>
          <div style={S.statsStrip}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={S.statItem}>
                <div className="b-skeleton" style={{ width: 60, height: 28, marginBottom: 8 }} />
                <div className="b-skeleton" style={{ width: 80, height: 12 }} />
              </div>
            ))}
          </div>
          <div style={S.cardsGrid}>
            {[1, 2, 3].map(i => (
              <div key={i} className="b-skeleton" style={{ borderRadius: 14, height: 260 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* Grid background (same as Hero) */}
      <div style={S.gridBg} aria-hidden />

      <div
        style={{
          ...S.page,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(16px)",
          transition: "opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s",
        }}
        className="b-page"
      >
        {/* ── Header ── */}
        <div style={S.header}>
          <div style={S.sectionLabel}>Billing</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <h1 style={S.h1}>Plans &amp; Usage</h1>
            <span
              style={{
                ...S.planBadge,
                background: isPro ? "#f0fdf4" : "#f5f5f5",
                color: isPro ? "#16a34a" : "#888",
                border: isPro ? "1px solid #bbf7d0" : "1px solid #e5e5e5",
              }}
            >
              {plan}
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: getStatusColor(status),
                boxShadow: `0 0 8px ${getStatusColor(status)}`,
                flexShrink: 0,
              }}
            />
          </div>
          <p style={S.subtitle}>
            Manage your subscription, track usage, and update billing details.
          </p>
        </div>

        {/* ── Stats strip (same pattern as Hero stats) ── */}
        <div
          style={{
            ...S.statsStrip,
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 0.15s",
          }}
          className="b-stats-strip"
        >
          {[
            { val: runs, label: "Runs this period" },
            { val: Math.max(0, limit - runs), label: "Remaining" },
            { val: limit, label: "Run limit" },
            { val: `${percent.toFixed(1)}%`, label: "Quota used" },
          ].map((s, i, arr) => (
            <div
              key={s.label}
              style={{ ...S.statItem, borderRight: i < arr.length - 1 ? "1px solid #e8e8e8" : "none" }}
              className="b-stat"
            >
              <div style={S.statNum}>{s.val}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Usage progress bar ── */}
        <div style={S.progressSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={S.progressLabel}>Workflow run usage</span>
            <span style={{
              ...S.progressLabel,
              color: percent > 90 ? "#ef4444" : percent > 70 ? "#f59e0b" : "#22c55e",
              fontWeight: 600,
            }}>
              {percent.toFixed(1)}%
            </span>
          </div>
          <div style={S.progressTrack}>
            <div
              style={{
                ...S.progressFill,
                width: `${percent}%`,
                background: percent > 90 ? "#ef4444" : percent > 70 ? "#f59e0b" : "#111",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ ...S.progressLabel, color: "#aaa" }}>{runs} used</span>
            <span style={{ ...S.progressLabel, color: "#aaa", fontFamily: "'Geist Mono', monospace", fontSize: 11 }}>
              Resets monthly
            </span>
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div style={S.cardsGrid}>

          {/* Current Plan Card */}
          <div style={S.card} className="b-card">
            <div style={S.cardTag}>Current Plan</div>
            <div style={S.planName}>{plan}</div>
            <div style={S.planPrice}>
              {isPro ? (
                <>
                  <span style={S.priceAmt}>$29</span>
                  <span style={S.pricePer}>/month</span>
                </>
              ) : (
                <span style={{ ...S.priceAmt, color: "#111" }}>Free</span>
              )}
            </div>

            <div style={S.featureList}>
              {[
                { label: `${isPro ? "Unlimited" : "100"} workflow runs`, active: true },
                { label: `${isPro ? "Priority" : "Community"} support`, active: true },
                { label: "Advanced analytics", active: isPro },
                { label: "Custom integrations", active: isPro },
              ].map((f) => (
                <div key={f.label} style={S.featureRow}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={f.active ? "#22c55e" : "#ddd"}
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ color: f.active ? "#444" : "#ccc" }}>{f.label}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "auto", paddingTop: 20 }}>
              {!isPro ? (
                <button
                  className="b-btn-primary"
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <><span className="b-spinner" /> Redirecting...</>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Upgrade to Pro
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="b-btn-ghost"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <><span className="b-spinner" /> Opening...</>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      Manage Subscription
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Subscription Details Card */}
          <div style={S.card} className="b-card">
            <div style={S.cardTag}>Subscription Details</div>
            <div style={S.detailList}>
              {[
                {
                  key: "Status",
                  val: (
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: "'Geist Mono', monospace",
                      background: `${getStatusColor(status)}15`,
                      color: getStatusColor(status),
                      border: `1px solid ${getStatusColor(status)}30`,
                      textTransform: "capitalize",
                    }}>
                      {status}
                    </span>
                  ),
                },
                {
                  key: "Current Period",
                  val: subscription?.current_period_start
                    ? `${new Date(subscription.current_period_start).toLocaleDateString()} → ${subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : "N/A"}`
                    : "—",
                },
                { key: "Billing Interval", val: "Monthly" },
                {
                  key: "Customer ID",
                  val: subscription?.customer_id
                    ? <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#aaa" }}>{subscription.customer_id.slice(0, 14)}…</span>
                    : "—",
                },
              ].map((row, i) => (
                <div key={i} style={S.detailRow}>
                  <span style={S.detailKey}>{row.key}</span>
                  <span style={S.detailVal}>{row.val}</span>
                </div>
              ))}
            </div>

            {isPro && (
              <div style={{ marginTop: 20 }}>
                <button
                  className="b-btn-ghost"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  {portalLoading ? "Opening portal..." : "Open Billing Portal"}
                </button>
              </div>
            )}
          </div>

          {/* Pro plan upsell / "You're on Pro" card */}
          <div style={{ ...S.card, ...(isPro ? S.proCard : S.upsellCard) }} className="b-card">
            {isPro ? (
              <>
                <div style={S.cardTag}>Your Plan</div>
                <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.04em", color: "#111", marginBottom: 6 }}>
                  Pro
                </div>
                <p style={{ fontSize: 14, color: "#888", lineHeight: 1.65, margin: "0 0 20px" }}>
                  You're on the Pro plan. Enjoy unlimited runs, priority support, and all premium features.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Unlimited workflow runs", "Priority support", "Advanced analytics", "Custom integrations", "GraphQL API access"].map(f => (
                    <div key={f} style={S.featureRow}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ color: "#444" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={S.cardTag}>Upgrade</div>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em", color: "#111", marginBottom: 4 }}>
                  Go Pro
                </div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: "#111", letterSpacing: "-0.04em" }}>$29</span>
                  <span style={{ fontSize: 14, color: "#888", marginLeft: 4 }}>/month</span>
                </div>
                <p style={{ fontSize: 13, color: "#888", lineHeight: 1.65, margin: "0 0 20px" }}>
                  Unlock unlimited runs, priority support, and advanced features.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {["Unlimited workflow runs", "Priority support", "Advanced analytics", "Custom integrations"].map(f => (
                    <div key={f} style={S.featureRow}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ color: "#444" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button className="b-btn-primary" onClick={handleUpgrade} disabled={checkoutLoading}>
                  {checkoutLoading ? <><span className="b-spinner" /> Redirecting…</> : "Upgrade to Pro →"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Invoices ── */}
        <div style={S.invoiceSection}>
          <div style={S.cardTag}>Recent Invoices</div>
          <div style={S.invoiceEmpty}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p style={{ margin: "8px 0 4px", fontSize: 14, fontWeight: 600, color: "#555" }}>
              No invoices yet
            </p>
            <span style={{ fontSize: 13, color: "#aaa" }}>
              Invoices will appear here once you upgrade to Pro.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const S = {
  root: {
    minHeight: "100vh",
    background: "#fafafa",
    color: "#111",
    fontFamily: "'Geist', 'Inter', 'Helvetica Neue', sans-serif",
    overflowX: "hidden",
    position: "relative",
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
    maxWidth: 1080,
    margin: "0 auto",
    padding: "40px 40px 80px",
  },
  header: {
    marginBottom: 36,
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
    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
    fontWeight: 700,
    letterSpacing: "-0.04em",
    color: "#111",
    lineHeight: 1.08,
    margin: 0,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    lineHeight: 1.65,
    margin: "8px 0 0",
    maxWidth: 500,
  },
  planBadge: {
    fontFamily: "'Geist Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 100,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    flexShrink: 0,
  },

  /* Stats strip — mirrors Hero statsStrip */
  statsStrip: {
    display: "flex",
    border: "1px solid #e8e8e8",
    borderRadius: 12,
    overflow: "hidden",
    background: "#fff",
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    padding: "24px 28px",
    cursor: "default",
    transition: "background 0.15s",
  },
  statNum: {
    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
    fontWeight: 700,
    letterSpacing: "-0.04em",
    color: "#111",
    lineHeight: 1,
    marginBottom: 6,
    fontFamily: "'Geist Mono', monospace",
  },
  statLabel: {
    fontSize: 11,
    color: "#aaa",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },

  /* Progress bar */
  progressSection: {
    background: "#fff",
    border: "1px solid #e8e8e8",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: 500,
  },
  progressTrack: {
    height: 6,
    background: "#f0f0f0",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  /* Cards grid */
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 1,
    background: "#e8e8e8",
    border: "1px solid #e8e8e8",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
  },
  card: {
    padding: "32px 28px",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    transition: "background 0.15s",
  },
  proCard: {
    background: "#fafff5",
  },
  upsellCard: {
    background: "#fff",
  },

  cardTag: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#bbb",
    marginBottom: 14,
    fontFamily: "'Geist Mono', monospace",
  },
  planName: {
    fontSize: 22,
    fontWeight: 700,
    textTransform: "capitalize",
    color: "#111",
    letterSpacing: "-0.03em",
    marginBottom: 4,
  },
  planPrice: {
    marginBottom: 20,
  },
  priceAmt: {
    fontSize: 32,
    fontWeight: 700,
    color: "#111",
    letterSpacing: "-0.04em",
  },
  pricePer: {
    fontSize: 14,
    color: "#aaa",
    marginLeft: 4,
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: 9,
    marginBottom: 16,
  },
  featureRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    color: "#555",
  },

  /* Detail rows */
  detailList: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    flex: 1,
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 13,
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  detailKey: {
    color: "#888",
    fontWeight: 500,
  },
  detailVal: {
    color: "#111",
    fontWeight: 500,
  },

  /* Invoices */
  invoiceSection: {
    background: "#fff",
    border: "1px solid #e8e8e8",
    borderRadius: 14,
    padding: "28px",
  },
  invoiceEmpty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "36px 20px",
    color: "#aaa",
    textAlign: "center",
  },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');

  .b-stat:hover { background: #f9f9f9; }

  .b-card:hover { background: #fafafa !important; }

  .b-btn-primary {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Geist', 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: -0.01em;
    transition: opacity 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .b-btn-primary:hover:not(:disabled) {
    opacity: 0.8;
    transform: translateY(-1px);
  }
  .b-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .b-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .b-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: transparent;
    color: #555;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    font-family: 'Geist', 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s, background 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .b-btn-ghost:hover:not(:disabled) {
    border-color: #bbb;
    color: #111;
    background: #f9f9f9;
    transform: translateY(-1px);
  }
  .b-btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }

  .b-spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: b-spin 0.6s linear infinite;
  }
  @keyframes b-spin { to { transform: rotate(360deg); } }

  .b-skeleton {
    background: #f0f0f0;
    border-radius: 6px;
    animation: b-pulse 1.5s ease-in-out infinite;
  }
  @keyframes b-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @media (max-width: 860px) {
    .b-cards-grid {
      grid-template-columns: 1fr !important;
    }
    .b-stats-strip {
      flex-direction: column !important;
    }
  }
  @media (max-width: 768px) {
    .b-page {
      padding: 90px 20px 60px !important;
    }
  }
`;

export default Billing;
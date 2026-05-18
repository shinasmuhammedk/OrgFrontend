import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function Billing() {
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
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
    if (s === "active" || s === "trialing") return "var(--accent-lime)";
    if (s === "past_due") return "var(--accent-rose)";
    return "var(--text-muted)";
  };

  if (loading) {
    return (
      <>
        <style>{billingStyles}</style>
        <div className="billing-container">
          <div className="billing-header">
            <div className="skeleton-title" />
            <div className="skeleton-subtitle" />
          </div>
          <div className="billing-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="billing-card skeleton-card" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{billingStyles}</style>
      <div className="billing-container">
        {/* Header */}
        <div className="billing-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <h1 className="billing-title">Billing</h1>
            <span
              className="plan-badge"
              style={{
                background: isPro ? "rgba(200,255,68,0.12)" : "rgba(255,255,255,0.06)",
                color: isPro ? "var(--accent-lime)" : "var(--text-secondary)",
                borderColor: isPro ? "rgba(200,255,68,0.2)" : "var(--border-subtle)",
              }}
            >
              {plan}
            </span>
            <span
              className="status-dot"
              style={{ background: getStatusColor(status) }}
            />
          </div>
          <p className="billing-subtitle">
            Manage your subscription, usage, and billing details.
          </p>
        </div>

        {/* Grid */}
        <div className="billing-grid">
          {/* Current Plan Card */}
          <div className="billing-card plan-card">
            <div className="card-label">Current Plan</div>
            <div className="plan-name">{plan}</div>
            <div className="plan-price">
              {isPro ? (
                <>
                  <span className="price-amount">$29</span>
                  <span className="price-period">/month</span>
                </>
              ) : (
                <span className="price-free">Free</span>
              )}
            </div>
            <div className="plan-features">
              <div className="feature-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{isPro ? "Unlimited" : "100"} workflow runs</span>
              </div>
              <div className="feature-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{isPro ? "Priority" : "Community"} support</span>
              </div>
              <div className="feature-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isPro ? "var(--accent-lime)" : "var(--text-muted)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ color: isPro ? "var(--text-primary)" : "var(--text-muted)" }}>
                  Advanced analytics
                </span>
              </div>
            </div>

            <div style={{ marginTop: "auto", paddingTop: 20 }}>
              {!isPro ? (
                <button
                  className="btn-primary"
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <span className="btn-loading">
                      <span className="spinner" />
                      Redirecting...
                    </span>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Upgrade to Pro
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="btn-secondary"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <span className="btn-loading">
                      <span className="spinner" />
                      Opening...
                    </span>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

          {/* Usage Card */}
          <div className="billing-card">
            <div className="card-header">
              <div className="card-label">Usage</div>
              <div className="usage-fraction">
                <span className="usage-current">{runs}</span>
                <span className="usage-separator">/</span>
                <span className="usage-limit">{limit}</span>
                <span className="usage-unit">runs</span>
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
                        ? "var(--accent-rose)"
                        : percent > 70
                        ? "var(--accent-violet)"
                        : "var(--accent-lime)",
                  }}
                />
              </div>
              <div className="progress-labels">
                <span style={{ color: percent > 90 ? "var(--accent-rose)" : "var(--text-muted)" }}>
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

          {/* Subscription Details */}
          <div className="billing-card">
            <div className="card-label">Subscription Details</div>
            <div className="details-list">
              <div className="detail-row">
                <span className="detail-key">Status</span>
                <span
                  className="detail-value status-badge"
                  style={{
                    background: `${getStatusColor(status)}15`,
                    color: getStatusColor(status),
                    border: `1px solid ${getStatusColor(status)}25`,
                  }}
                >
                  {status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-key">Current Period</span>
                <span className="detail-value">
                  {subscription?.current_period_start
                    ? new Date(subscription.current_period_start).toLocaleDateString()
                    : "—"}{" "}
                  →{" "}
                  {subscription?.current_period_end
                    ? new Date(subscription.current_period_end).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-key">Billing Interval</span>
                <span className="detail-value">Monthly</span>
              </div>
              <div className="detail-row">
                <span className="detail-key">Customer ID</span>
                <span className="detail-value mono">
                  {subscription?.customer_id?.slice(0, 12) || "—"}...
                </span>
              </div>
            </div>

            {isPro && (
              <div style={{ marginTop: 16 }}>
                <button
                  className="btn-ghost"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  {portalLoading ? "Opening portal..." : "Open Billing Portal"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Invoice History Placeholder */}
        <div className="billing-card invoice-card">
          <div className="card-label">Recent Invoices</div>
          <div className="invoice-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <p>No invoices yet</p>
            <span>Invoices will appear here once you upgrade.</span>
          </div>
        </div>
      </div>
    </>
  );
}

const billingStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --bg: #0a0a0f;
    --bg-elevated: #12121a;
    --bg-surface: #181824;
    --bg-hover: #1e1e2e;
    --border-subtle: rgba(255,255,255,0.06);
    --border-default: rgba(255,255,255,0.1);
    --text-primary: #f0f0f5;
    --text-secondary: #8b8ba7;
    --text-muted: #5a5a7a;
    --accent-lime: #c8ff44;
    --accent-lime-dim: rgba(200,255,68,0.12);
    --accent-rose: #ff4775;
    --accent-violet: #a78bfa;
    --accent-cyan: #22d3ee;
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
  }

  .billing-container {
    font-family: var(--font-sans);
    color: var(--text-primary);
    background: var(--bg);
    min-height: 100vh;
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .billing-header {
    margin-bottom: 32px;
  }

  .billing-title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0;
    color: var(--text-primary);
  }

  .billing-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
    margin-top: 6px;
  }

  .plan-badge {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    box-shadow: 0 0 8px currentColor;
  }

  .billing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }

  .billing-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .billing-card:hover {
    border-color: var(--border-default);
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  }

  .plan-card {
    background: linear-gradient(145deg, var(--bg-elevated) 0%, rgba(200,255,68,0.03) 100%);
    border-color: rgba(200,255,68,0.08);
  }

  .card-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 16px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
  }

  .plan-name {
    font-size: 24px;
    font-weight: 700;
    text-transform: capitalize;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .plan-price {
    margin-bottom: 20px;
  }

  .price-amount {
    font-size: 36px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .price-period {
    font-size: 14px;
    color: var(--text-secondary);
    margin-left: 4px;
  }

  .price-free {
    font-size: 36px;
    font-weight: 700;
    color: var(--accent-lime);
  }

  .plan-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .feature-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .usage-fraction {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .usage-current {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .usage-separator {
    font-size: 18px;
    color: var(--text-muted);
    margin: 0 2px;
  }

  .usage-limit {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .usage-unit {
    font-size: 13px;
    color: var(--text-muted);
    margin-left: 4px;
  }

  .progress-container {
    margin-bottom: 24px;
  }

  .progress-track {
    height: 6px;
    background: var(--bg-surface);
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
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 11px;
  }

  .usage-breakdown {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid var(--border-subtle);
  }

  .usage-stat {
    text-align: center;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    font-family: var(--font-mono);
  }

  .stat-label {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .details-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .detail-key {
    color: var(--text-secondary);
  }

  .detail-value {
    color: var(--text-primary);
    font-weight: 500;
  }

  .detail-value.mono {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-muted);
  }

  .status-badge {
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;
    font-family: var(--font-mono);
  }

  .btn-primary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 10px;
    background: var(--accent-lime);
    color: #0a0a0f;
    border: none;
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: -0.01em;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(200,255,68,0.25);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 10px;
    background: var(--bg-surface);
    color: var(--text-primary);
    border: 1px solid var(--border-default);
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--bg-hover);
    border-color: var(--border-default);
    transform: translateY(-1px);
  }

  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-ghost {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 8px;
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-subtle);
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-ghost:hover:not(:disabled) {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--border-default);
  }

  .btn-loading {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .invoice-card {
    margin-top: 8px;
  }

  .invoice-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: var(--text-muted);
    gap: 8px;
  }

  .invoice-empty p {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .invoice-empty span {
    font-size: 12px;
  }

  /* Skeleton Loading */
  .skeleton-title {
    height: 32px;
    width: 200px;
    background: var(--bg-surface);
    border-radius: 8px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .skeleton-subtitle {
    height: 16px;
    width: 300px;
    background: var(--bg-surface);
    border-radius: 6px;
    margin-top: 12px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .skeleton-card {
    height: 240px;
    background: var(--bg-surface);
    animation: pulse 1.5s ease-in-out infinite;
    border: none;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }

  @media (max-width: 768px) {
    .billing-container {
      padding: 20px;
    }
    .billing-grid {
      grid-template-columns: 1fr;
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
`;

export default Billing;
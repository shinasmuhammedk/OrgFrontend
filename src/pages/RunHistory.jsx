import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function RunHistory() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [steps, setSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const formatJSON = (value) => {
    if (!value) return "null";
    try {
      if (typeof value === "string") {
        return JSON.stringify(JSON.parse(value), null, 2);
      }
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchStepLogs = async () => {
      try {
        setLoading(true);
        const res = await api.getWorkflowStepRuns(id);
        const data = res.data || [];
        setSteps(data);
        if (data.length > 0) setSelectedStep(data[0]);
      } catch (err) {
        setError(err.message || "Failed to load step logs");
      } finally {
        setLoading(false);
      }
    };

    fetchStepLogs();
  }, [id, navigate]);

  const formatDuration = (started, finished) => {
    if (!started || !finished) return "—";
    const start = new Date(started);
    const end = new Date(finished);
    const ms = end - start;
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "—";
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusConfig = (status) => {
    const s = (status || "unknown").toLowerCase();
    if (s === "success" || s === "completed") {
      return {
        color: "#16a34a",
        bg: "#f0fdf4",
        border: "#bbf7d0",
        icon: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
        label: "SUCCESS",
      };
    }
    if (s === "failed" || s === "error") {
      return {
        color: "#ef4444",
        bg: "#fef2f2",
        border: "#fecaca",
        icon: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
        label: "FAILED",
      };
    }
    if (s === "running" || s === "in_progress") {
      return {
        color: "#0284c7",
        bg: "#f0f9ff",
        border: "#bae6fd",
        icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
        label: "RUNNING",
      };
    }
    return {
      color: "#d97706",
      bg: "#fffbeb",
      border: "#fde68a",
      icon: "M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
      label: s.toUpperCase(),
    };
  };

  const filteredSteps = steps.filter((step) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const status = (step.Status || step.status || "").toLowerCase();
    const stepId = String(step.WorkflowStepID || step.workflow_step_id || "");
    return status.includes(q) || stepId.includes(q);
  });

  const successCount = steps.filter((s) => {
    const status = (s.Status || s.status || "").toLowerCase();
    return status === "success" || status === "completed";
  }).length;

  const failedCount = steps.filter((s) => {
    const status = (s.Status || s.status || "").toLowerCase();
    return status === "failed" || status === "error";
  }).length;

  const totalDuration = steps.reduce((acc, step) => {
    const started = step.StartedAt?.Time || step.started_at;
    const finished = step.FinishedAt?.Time || step.finished_at;
    if (started && finished) {
      return acc + (new Date(finished) - new Date(started));
    }
    return acc;
  }, 0);

  return (
    <div style={S.root} className="rh-root">
      <style>{CSS}</style>
      <div style={S.gridBg} aria-hidden />

      <div style={{
          ...S.container,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease"
      }}>
        {/* Header */}
        <div style={S.header}>
          <div style={S.headerLeft}>
            <button className="rh-back" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div style={S.titleGroup}>
              <h1 style={S.title}>Run Details</h1>
              <span style={S.subtitle}>Step-by-step execution logs for workflow #{id}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={S.stats}>
          <div style={S.stat}>
            <div style={{ ...S.statIcon, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
            </div>
            <div style={S.statInfo}>
              <div style={{ ...S.statValue, color: '#16a34a' }}>{successCount}</div>
              <div style={S.statLabel}>Passed</div>
            </div>
          </div>

          <div style={S.stat}>
            <div style={{ ...S.statIcon, background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444' }}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </div>
            <div style={S.statInfo}>
              <div style={{ ...S.statValue, color: '#ef4444' }}>{failedCount}</div>
              <div style={S.statLabel}>Failed</div>
            </div>
          </div>

          <div style={S.stat}>
            <div style={{ ...S.statIcon, background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7' }}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
            </div>
            <div style={S.statInfo}>
              <div style={{ ...S.statValue, color: '#0284c7' }}>
                {totalDuration < 1000 ? `${totalDuration}ms` : `${(totalDuration / 1000).toFixed(1)}s`}
              </div>
              <div style={S.statLabel}>Total Duration</div>
            </div>
          </div>

          <div style={S.stat}>
            <div style={{ ...S.statIcon, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#4b5563' }}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
            </div>
            <div style={S.statInfo}>
              <div style={{ ...S.statValue, color: '#111' }}>{steps.length}</div>
              <div style={S.statLabel}>Total Steps</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={S.toolbar}>
          <div className="rh-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Filter by status or step ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={S.errorBanner}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={S.loading}>
            <div className="rh-spinner" />
            <span style={{ fontSize: 14, color: '#888' }}>Loading step logs...</span>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <div className="rh-grid">
            {/* Steps List */}
            <div className="rh-steps">
              {filteredSteps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888', fontSize: 14 }}>
                  No steps match your filter.
                </div>
              ) : (
                filteredSteps.map((step, index) => {
                  const stepId = step.ID || step.id;
                  const isSelected = (selectedStep?.ID || selectedStep?.id) === stepId;
                  const status = step.Status || step.status || "unknown";
                  const config = getStatusConfig(status);
                  const started = step.StartedAt?.Time || step.started_at;
                  const finished = step.FinishedAt?.Time || step.finished_at;

                  return (
                    <div
                      key={stepId}
                      className={`rh-step ${isSelected ? 'active' : ''}`}
                      style={{
                        '--step-color': config.color,
                        '--step-bg': config.bg,
                        '--step-border': config.border,
                      }}
                      onClick={() => setSelectedStep(step)}
                    >
                      <div style={S.stepHeader}>
                        <span style={S.stepNum}>Step {index + 1}</span>
                        <span
                          style={{
                            ...S.stepStatus,
                            background: config.bg,
                            color: config.color,
                            border: `1px solid ${config.border}`,
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
                            <path d={config.icon} />
                          </svg>
                          {config.label}
                        </span>
                      </div>
                      <div style={S.stepId}>
                        ID: {step.WorkflowStepID || step.workflow_step_id || "—"}
                      </div>
                      <div style={S.stepMeta}>
                        <span style={S.metaItem}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {formatDuration(started, finished)}
                        </span>
                        <span style={S.metaItem}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          {formatTimeAgo(finished || started)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Detail Panel */}
            <div style={S.detail}>
              {!selectedStep ? (
                <div style={S.detailEmpty}>
                  <div style={S.emptyIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M16 13H8M16 17H8M10 9H8" />
                    </svg>
                  </div>
                  <div style={S.emptyTitle}>Select a step</div>
                  <div style={S.emptyDesc}>
                    Click on any step from the list to view its input, output, and error details.
                  </div>
                </div>
              ) : (
                <>
                  <div style={S.detailHeader}>
                    <div style={S.detailTitle}>
                      Step {(steps.findIndex(s => (s.ID || s.id) === (selectedStep.ID || selectedStep.id)) + 1) || "—"}
                      <span
                        style={{
                          ...S.detailBadge,
                          background: getStatusConfig(selectedStep.Status || selectedStep.status).bg,
                          color: getStatusConfig(selectedStep.Status || selectedStep.status).color,
                          border: `1px solid ${getStatusConfig(selectedStep.Status || selectedStep.status).border}`,
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
                          <path d={getStatusConfig(selectedStep.Status || selectedStep.status).icon} />
                        </svg>
                        {getStatusConfig(selectedStep.Status || selectedStep.status).label}
                      </span>
                    </div>
                  </div>

                  <div className="rh-detail-body">
                    {/* Input */}
                    <div style={S.section}>
                      <div style={S.sectionHeader}>
                        <span style={S.sectionTitle}>Input</span>
                        <button
                          className="rh-section-copy"
                          onClick={() => navigator.clipboard.writeText(formatJSON(selectedStep.Input?.RawMessage || selectedStep.input))}
                        >
                          Copy
                        </button>
                      </div>
                      <div style={S.codeBlock}>
                        <div style={S.codeHeader}>
                          <span style={{ ...S.codeDot, background: '#ef4444' }} />
                          <span style={{ ...S.codeDot, background: '#f59e0b' }} />
                          <span style={{ ...S.codeDot, background: '#10b981' }} />
                          <span style={S.codeTitle}>input.json</span>
                        </div>
                        <pre className="rh-code-body">
                          {formatJSON(selectedStep.Input?.RawMessage || selectedStep.input)}
                        </pre>
                      </div>
                    </div>

                    {/* Output */}
                    <div style={S.section}>
                      <div style={S.sectionHeader}>
                        <span style={S.sectionTitle}>Output</span>
                        <button
                          className="rh-section-copy"
                          onClick={() => navigator.clipboard.writeText(formatJSON(selectedStep.Output?.RawMessage || selectedStep.output))}
                        >
                          Copy
                        </button>
                      </div>
                      <div style={S.codeBlock}>
                        <div style={S.codeHeader}>
                          <span style={{ ...S.codeDot, background: '#ef4444' }} />
                          <span style={{ ...S.codeDot, background: '#f59e0b' }} />
                          <span style={{ ...S.codeDot, background: '#10b981' }} />
                          <span style={S.codeTitle}>output.json</span>
                        </div>
                        <pre className="rh-code-body">
                          {formatJSON(selectedStep.Output?.RawMessage || selectedStep.output)}
                        </pre>
                      </div>
                    </div>

                    {/* Error */}
                    {(selectedStep.ErrorMessage?.Valid || selectedStep.error_message) && (
                      <div style={S.section}>
                        <div style={S.sectionHeader}>
                          <span style={{ ...S.sectionTitle, color: '#ef4444' }}>Error</span>
                        </div>
                        <div style={{ ...S.codeBlock, borderColor: '#fecaca' }}>
                          <div style={{ ...S.codeHeader, background: '#fef2f2' }}>
                            <span style={{ ...S.codeDot, background: '#ef4444' }} />
                            <span style={{ ...S.codeTitle, color: '#ef4444' }}>error.log</span>
                          </div>
                          <pre className="rh-code-body" style={{ color: '#ef4444' }}>
                            {selectedStep.ErrorMessage?.Valid
                              ? selectedStep.ErrorMessage.String
                              : selectedStep.error_message || "null"}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div style={S.section}>
                      <span style={S.sectionTitle}>Metadata</span>
                      <div style={S.metaGrid}>
                        {[
                          { label: 'Step ID', value: selectedStep.WorkflowStepID || selectedStep.workflow_step_id || '—' },
                          { label: 'Started', value: selectedStep.StartedAt?.Time || selectedStep.started_at || '—' },
                          { label: 'Finished', value: selectedStep.FinishedAt?.Time || selectedStep.finished_at || '—' },
                          { label: 'Duration', value: formatDuration(
                            selectedStep.StartedAt?.Time || selectedStep.started_at,
                            selectedStep.FinishedAt?.Time || selectedStep.finished_at
                          )},
                        ].map((item) => (
                          <div key={item.label}>
                            <div style={S.metaKey}>{item.label}</div>
                            <div style={S.metaValue}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  root: {
    minHeight: "100vh", background: "#fafafa", color: "#111",
    fontFamily: "'Geist', 'Inter', sans-serif", position: "relative",
    padding: "40px 32px", overflowX: "hidden",
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
    position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 24, flexWrap: "wrap", gap: 16,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  titleGroup: { display: "flex", flexDirection: "column", gap: 4 },
  title: {
    fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em",
    color: "#111", margin: 0,
  },
  subtitle: { fontSize: 14, color: "#888", fontWeight: 500 },
  stats: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28,
  },
  stat: {
    background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12,
    padding: "16px 18px", display: "flex", alignItems: "center", gap: 12,
  },
  statIcon: {
    width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0,
  },
  statInfo: { flex: 1 },
  statValue: {
    fontSize: 20, fontWeight: 700, color: "#111", lineHeight: 1, letterSpacing: "-0.02em",
  },
  statLabel: {
    fontSize: 12, color: "#888", marginTop: 4, fontWeight: 500,
  },
  toolbar: {
    display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap",
  },
  errorBanner: {
    display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
    borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca",
    color: "#ef4444", fontSize: 14, marginBottom: 20,
  },
  loading: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px 20px", gap: 16,
  },
  stepHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10,
  },
  stepNum: {
    fontSize: 12, fontWeight: 700, color: "#888", fontFamily: "'Geist Mono', monospace",
  },
  stepStatus: {
    display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
    borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.06em", fontFamily: "'Geist Mono', monospace",
  },
  stepId: {
    fontSize: 12, color: "#888", fontFamily: "'Geist Mono', monospace", marginBottom: 8,
  },
  stepMeta: {
    display: "flex", alignItems: "center", gap: 12, fontSize: 11,
    color: "#888", fontFamily: "'Geist Mono', monospace",
  },
  metaItem: { display: "flex", alignItems: "center", gap: 4 },
  detail: {
    background: "#fff", border: "1px solid #e5e5e5", borderRadius: 14,
    display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 500,
  },
  detailEmpty: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px 20px", textAlign: "center", gap: 16, height: "100%",
  },
  emptyIcon: {
    width: 56, height: 56, borderRadius: 14, background: "#fafafa",
    border: "1px solid #e5e5e5", display: "flex", alignItems: "center",
    justifyContent: "center", color: "#888",
  },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: "#111" },
  emptyDesc: { fontSize: 13, color: "#888", maxWidth: 240, lineHeight: 1.5 },
  detailHeader: {
    padding: "20px 24px", borderBottom: "1px solid #e5e5e5",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  detailTitle: {
    fontSize: 16, fontWeight: 700, color: "#111", display: "flex", alignItems: "center", gap: 10,
  },
  detailBadge: {
    display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px",
    borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.04em", fontFamily: "'Geist Mono', monospace",
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase",
    letterSpacing: "0.06em", fontFamily: "'Geist Mono', monospace",
  },
  codeBlock: {
    background: "#fafafa", border: "1px solid #e5e5e5", borderRadius: 10, overflow: "hidden",
  },
  codeHeader: {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
    borderBottom: "1px solid #e5e5e5", background: "#fff",
  },
  codeDot: { width: 8, height: 8, borderRadius: "50%" },
  codeTitle: { fontSize: 11, color: "#888", fontFamily: "'Geist Mono', monospace" },
  metaGrid: {
    display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12,
    padding: 16, background: "#fafafa", borderRadius: 10, border: "1px solid #e5e5e5",
  },
  metaKey: { fontSize: 11, color: "#888", marginBottom: 4, fontFamily: "'Geist Mono', monospace" },
  metaValue: { fontSize: 13, color: "#111", fontFamily: "'Geist Mono', monospace" },
};

const CSS = `
  .rh-back {
    display: flex; align-items: center; gap: 8px; padding: 8px 14px;
    border-radius: 8px; background: #fff; border: 1px solid #e5e5e5;
    color: #555; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: inherit;
  }
  .rh-back:hover { background: #fafafa; color: #111; border-color: #ccc; }
  .rh-search {
    flex: 1; min-width: 240px; max-width: 360px; display: flex; align-items: center; gap: 10px;
    background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 9px 14px;
    transition: all 0.2s;
  }
  .rh-search:focus-within { border-color: #111; box-shadow: 0 0 0 2px rgba(0,0,0,0.05); }
  .rh-search svg { width: 16px; height: 16px; color: #888; flex-shrink: 0; }
  .rh-search input {
    background: none; border: none; color: #111; font-size: 13px;
    font-family: inherit; width: 100%; outline: none;
  }
  .rh-search input::placeholder { color: #aaa; }
  .rh-spinner {
    width: 32px; height: 32px; border: 2px solid #e5e5e5; border-top-color: #111;
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .rh-grid { display: grid; grid-template-columns: 380px 1fr; gap: 20px; min-height: 500px; }
  .rh-steps {
    display: flex; flex-direction: column; gap: 10px; max-height: 70vh;
    overflow-y: auto; padding-right: 4px;
  }
  .rh-steps::-webkit-scrollbar { width: 4px; }
  .rh-steps::-webkit-scrollbar-track { background: transparent; }
  .rh-steps::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 4px; }
  .rh-step {
    background: #fff; border: 1px solid #e5e5e5; border-radius: 12px;
    padding: 16px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
  }
  .rh-step:hover { border-color: #ccc; transform: translateX(2px); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .rh-step.active { border-color: var(--step-border); background: var(--step-bg); }
  .rh-step.active::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: var(--step-color); border-radius: 0 2px 2px 0;
  }
  .rh-detail-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
  .rh-detail-body::-webkit-scrollbar { width: 4px; }
  .rh-detail-body::-webkit-scrollbar-track { background: transparent; }
  .rh-detail-body::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 4px; }
  .rh-section-copy {
    padding: 4px 10px; border-radius: 6px; background: #fff; border: 1px solid #e5e5e5;
    color: #555; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    font-family: 'Geist Mono', monospace;
  }
  .rh-section-copy:hover { background: #fafafa; color: #111; border-color: #ccc; }
  .rh-code-body {
    padding: 16px; font-family: 'Geist Mono', monospace; font-size: 12px;
    line-height: 1.6; color: #333; overflow-x: auto; white-space: pre-wrap;
    word-break: break-word; max-height: 300px; overflow-y: auto; margin: 0;
  }
  .rh-code-body::-webkit-scrollbar { width: 4px; height: 4px; }
  .rh-code-body::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 4px; }
  @media (max-width: 1024px) {
    .rh-grid { grid-template-columns: 1fr; }
    .rh-steps { max-height: none; }
  }
  @media (max-width: 768px) {
    .rh-root { padding: 40px 16px 60px !important; }
    .rh-stats { grid-template-columns: repeat(2, 1fr) !important; }
    .rh-search { max-width: 100%; }
  }
`;

export default RunHistory;
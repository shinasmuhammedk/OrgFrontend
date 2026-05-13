// src/RunHistory.jsx — Redesigned Step-by-Step Execution Logs
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
        color: "#c8ff44",
        bg: "rgba(200,255,68,0.08)",
        border: "rgba(200,255,68,0.15)",
        icon: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
        label: "SUCCESS",
      };
    }
    if (s === "failed" || s === "error") {
      return {
        color: "#ff4775",
        bg: "rgba(255,71,117,0.08)",
        border: "rgba(255,71,117,0.15)",
        icon: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
        label: "FAILED",
      };
    }
    if (s === "running" || s === "in_progress") {
      return {
        color: "#22d3ee",
        bg: "rgba(34,211,238,0.08)",
        border: "rgba(34,211,238,0.15)",
        icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
        label: "RUNNING",
      };
    }
    return {
      color: "#fb923c",
      bg: "rgba(251,146,60,0.08)",
      border: "rgba(251,146,60,0.15)",
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .rh-root {
          min-height: 100vh;
          background: #0a0a0f;
          color: #f0f0f5;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 28px 32px;
        }

        .rh-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .rh-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .rh-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .rh-back {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          color: #6b6b8a;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }

        .rh-back:hover {
          background: rgba(255,255,255,0.04);
          color: #f0f0f5;
          border-color: rgba(255,255,255,0.12);
        }

        .rh-back svg {
          width: 16px;
          height: 16px;
        }

        .rh-title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rh-title {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #f0f0f5;
          margin: 0;
        }

        .rh-title span {
          color: #c8ff44;
        }

        .rh-subtitle {
          font-size: 14px;
          color: #5a5a7a;
          font-weight: 500;
        }

        .rh-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }

        .rh-stat {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rh-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rh-stat-icon svg {
          width: 18px;
          height: 18px;
        }

        .rh-stat-info {
          flex: 1;
        }

        .rh-stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #f0f0f5;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .rh-stat-label {
          font-size: 12px;
          color: #4a4a6a;
          margin-top: 4px;
          font-weight: 500;
        }

        .rh-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .rh-search {
          flex: 1;
          min-width: 240px;
          max-width: 360px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 9px 14px;
          transition: all 0.2s ease;
        }

        .rh-search:focus-within {
          border-color: rgba(200,255,68,0.3);
          box-shadow: 0 0 0 3px rgba(200,255,68,0.06);
        }

        .rh-search svg {
          width: 16px;
          height: 16px;
          color: #4a4a6a;
          flex-shrink: 0;
        }

        .rh-search input {
          background: none;
          border: none;
          color: #f0f0f5;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          width: 100%;
          outline: none;
        }

        .rh-search input::placeholder {
          color: #4a4a6a;
        }

        .rh-error {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(255,71,117,0.06);
          border: 1px solid rgba(255,71,117,0.12);
          color: #ff4775;
          font-size: 14px;
          margin-bottom: 20px;
          animation: slideDown 0.3s ease;
        }

        .rh-error svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rh-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 16px;
        }

        .rh-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(200,255,68,0.15);
          border-top-color: #c8ff44;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .rh-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 20px;
          min-height: 500px;
        }

        .rh-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 70vh;
          overflow-y: auto;
          padding-right: 4px;
        }

        .rh-steps::-webkit-scrollbar {
          width: 4px;
        }
        .rh-steps::-webkit-scrollbar-track {
          background: transparent;
        }
        .rh-steps::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
        }

        .rh-step {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .rh-step:hover {
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          transform: translateX(4px);
        }

        .rh-step.active {
          border-color: var(--step-border);
          background: var(--step-bg);
        }

        .rh-step.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--step-color);
          border-radius: 0 2px 2px 0;
        }

        .rh-step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .rh-step-num {
          font-size: 12px;
          font-weight: 700;
          color: #4a4a6a;
          font-family: 'JetBrains Mono', monospace;
        }

        .rh-step-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-family: 'JetBrains Mono', monospace;
        }

        .rh-step-status svg {
          width: 12px;
          height: 12px;
        }

        .rh-step-id {
          font-size: 12px;
          color: #4a4a6a;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 8px;
        }

        .rh-step-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          color: #4a4a6a;
          font-family: 'JetBrains Mono', monospace;
        }

        .rh-step-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rh-step-meta svg {
          width: 12px;
          height: 12px;
        }

        .rh-detail {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 500px;
        }

        .rh-detail-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
          gap: 16px;
        }

        .rh-detail-empty-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: rgba(200,255,68,0.06);
          border: 1px solid rgba(200,255,68,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rh-detail-empty-icon svg {
          width: 24px;
          height: 24px;
          color: #c8ff44;
        }

        .rh-detail-empty-title {
          font-size: 16px;
          font-weight: 700;
          color: #e8e8f0;
        }

        .rh-detail-empty-desc {
          font-size: 13px;
          color: #5a5a7a;
          max-width: 240px;
          line-height: 1.5;
        }

        .rh-detail-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rh-detail-title {
          font-size: 16px;
          font-weight: 700;
          color: #f0f0f5;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rh-detail-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-family: 'JetBrains Mono', monospace;
        }

        .rh-detail-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
        }

        .rh-detail-body::-webkit-scrollbar {
          width: 4px;
        }
        .rh-detail-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .rh-detail-body::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
        }

        .rh-section {
          margin-bottom: 24px;
        }

        .rh-section:last-child {
          margin-bottom: 0;
        }

        .rh-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .rh-section-title {
          font-size: 13px;
          font-weight: 700;
          color: #8b8ba7;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-family: 'JetBrains Mono', monospace;
        }

        .rh-section-copy {
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          color: #4a4a6a;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'JetBrains Mono', monospace;
        }

        .rh-section-copy:hover {
          background: rgba(255,255,255,0.08);
          color: #f0f0f5;
        }

        .rh-code-block {
          background: #0d0d14;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          overflow: hidden;
        }

        .rh-code-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
        }

        .rh-code-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .rh-code-title {
          font-size: 11px;
          color: #4a4a6a;
          font-family: 'JetBrains Mono', monospace;
        }

        .rh-code-body {
          padding: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          line-height: 1.7;
          color: #8b8ba7;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
          max-height: 300px;
          overflow-y: auto;
        }

        .rh-code-body::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .rh-code-body::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .rh-grid { grid-template-columns: 1fr; }
          .rh-steps { max-height: none; }
          .rh-stats { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .rh-root { padding: 20px 16px; }
          .rh-stats { grid-template-columns: 1fr; }
          .rh-header { flex-direction: column; align-items: flex-start; }
          .rh-toolbar { flex-direction: column; align-items: stretch; }
          .rh-search { max-width: none; min-width: auto; }
        }
      `}</style>

      <div className="rh-root">
        <div className="rh-container">
          {/* Header */}
          <div className="rh-header">
            <div className="rh-header-left">
              <button className="rh-back" onClick={() => navigate(-1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div className="rh-title-group">
                <h1 className="rh-title">
                  Run <span>Details</span>
                </h1>
                <span className="rh-subtitle">Step-by-step execution logs for workflow #{id}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rh-stats">
            <div className="rh-stat">
              <div className="rh-stat-icon" style={{ background: 'rgba(200,255,68,0.08)', border: '1px solid rgba(200,255,68,0.12)' }}>
                <svg viewBox="0 0 24 24" fill="#c8ff44">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <div className="rh-stat-info">
                <div className="rh-stat-value" style={{ color: '#c8ff44' }}>{successCount}</div>
                <div className="rh-stat-label">Passed</div>
              </div>
            </div>

            <div className="rh-stat">
              <div className="rh-stat-icon" style={{ background: 'rgba(255,71,117,0.08)', border: '1px solid rgba(255,71,117,0.12)' }}>
                <svg viewBox="0 0 24 24" fill="#ff4775">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </div>
              <div className="rh-stat-info">
                <div className="rh-stat-value" style={{ color: '#ff4775' }}>{failedCount}</div>
                <div className="rh-stat-label">Failed</div>
              </div>
            </div>

            <div className="rh-stat">
              <div className="rh-stat-icon" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.12)' }}>
                <svg viewBox="0 0 24 24" fill="#22d3ee">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <div className="rh-stat-info">
                <div className="rh-stat-value" style={{ color: '#22d3ee' }}>
                  {totalDuration < 1000 ? `${totalDuration}ms` : `${(totalDuration / 1000).toFixed(1)}s`}
                </div>
                <div className="rh-stat-label">Total Duration</div>
              </div>
            </div>

            <div className="rh-stat">
              <div className="rh-stat-icon" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.12)' }}>
                <svg viewBox="0 0 24 24" fill="#a78bfa">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
              </div>
              <div className="rh-stat-info">
                <div className="rh-stat-value">{steps.length}</div>
                <div className="rh-stat-label">Total Steps</div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="rh-toolbar">
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
            <div className="rh-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="rh-loading">
              <div className="rh-spinner" />
              <span style={{ fontSize: 14, color: '#5a5a7a' }}>Loading step logs...</span>
            </div>
          )}

          {/* Content */}
          {!loading && (
            <div className="rh-grid">
              {/* Steps List */}
              <div className="rh-steps">
                {filteredSteps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5a5a7a', fontSize: 14 }}>
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
                        <div className="rh-step-header">
                          <span className="rh-step-num">Step {index + 1}</span>
                          <span
                            className="rh-step-status"
                            style={{
                              background: config.bg,
                              color: config.color,
                              border: `1px solid ${config.border}`,
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d={config.icon} />
                            </svg>
                            {config.label}
                          </span>
                        </div>
                        <div className="rh-step-id">
                          ID: {step.WorkflowStepID || step.workflow_step_id || "—"}
                        </div>
                        <div className="rh-step-meta">
                          <span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {formatDuration(started, finished)}
                          </span>
                          <span>
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
              <div className="rh-detail">
                {!selectedStep ? (
                  <div className="rh-detail-empty">
                    <div className="rh-detail-empty-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M16 13H8M16 17H8M10 9H8" />
                      </svg>
                    </div>
                    <div className="rh-detail-empty-title">Select a step</div>
                    <div className="rh-detail-empty-desc">
                      Click on any step from the list to view its input, output, and error details.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rh-detail-header">
                      <div className="rh-detail-title">
                        Step {(steps.findIndex(s => (s.ID || s.id) === (selectedStep.ID || selectedStep.id)) + 1) || "—"}
                        <span
                          className="rh-detail-badge"
                          style={{
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
                      <div className="rh-section">
                        <div className="rh-section-header">
                          <span className="rh-section-title">Input</span>
                          <button
                            className="rh-section-copy"
                            onClick={() => navigator.clipboard.writeText(formatJSON(selectedStep.Input?.RawMessage || selectedStep.input))}
                          >
                            Copy
                          </button>
                        </div>
                        <div className="rh-code-block">
                          <div className="rh-code-header">
                            <span className="rh-code-dot" style={{ background: '#ff5f57' }} />
                            <span className="rh-code-dot" style={{ background: '#febc2e' }} />
                            <span className="rh-code-dot" style={{ background: '#28c840' }} />
                            <span className="rh-code-title">input.json</span>
                          </div>
                          <pre className="rh-code-body">
                            {formatJSON(selectedStep.Input?.RawMessage || selectedStep.input)}
                          </pre>
                        </div>
                      </div>

                      {/* Output */}
                      <div className="rh-section">
                        <div className="rh-section-header">
                          <span className="rh-section-title">Output</span>
                          <button
                            className="rh-section-copy"
                            onClick={() => navigator.clipboard.writeText(formatJSON(selectedStep.Output?.RawMessage || selectedStep.output))}
                          >
                            Copy
                          </button>
                        </div>
                        <div className="rh-code-block">
                          <div className="rh-code-header">
                            <span className="rh-code-dot" style={{ background: '#ff5f57' }} />
                            <span className="rh-code-dot" style={{ background: '#febc2e' }} />
                            <span className="rh-code-dot" style={{ background: '#28c840' }} />
                            <span className="rh-code-title">output.json</span>
                          </div>
                          <pre className="rh-code-body">
                            {formatJSON(selectedStep.Output?.RawMessage || selectedStep.output)}
                          </pre>
                        </div>
                      </div>

                      {/* Error */}
                      {(selectedStep.ErrorMessage?.Valid || selectedStep.error_message) && (
                        <div className="rh-section">
                          <div className="rh-section-header">
                            <span className="rh-section-title" style={{ color: '#ff4775' }}>Error</span>
                          </div>
                          <div className="rh-code-block" style={{ borderColor: 'rgba(255,71,117,0.15)' }}>
                            <div className="rh-code-header" style={{ background: 'rgba(255,71,117,0.04)' }}>
                              <span className="rh-code-dot" style={{ background: '#ff4775' }} />
                              <span className="rh-code-title" style={{ color: '#ff4775' }}>error.log</span>
                            </div>
                            <pre className="rh-code-body" style={{ color: '#ff4775' }}>
                              {selectedStep.ErrorMessage?.Valid
                                ? selectedStep.ErrorMessage.String
                                : selectedStep.error_message || "null"}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="rh-section">
                        <span className="rh-section-title">Metadata</span>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '12px',
                          padding: '16px',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: 10,
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
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
                              <div style={{ fontSize: 11, color: '#4a4a6a', marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: 13, color: '#e8e8f0', fontFamily: "'JetBrains Mono', monospace" }}>
                                {item.value}
                              </div>
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
    </>
  );
}

export default RunHistory;
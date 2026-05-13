// src/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getWorkflows();
      const data = res.data || [];
      setWorkflows(data);
      setFilteredWorkflows(data);
    } catch (err) {
      setError(err.message || "Failed to load workflows");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = async () => {
    try {
      setCreating(true);
      setError("");

      const res = await api.createWorkflow("Untitled Workflow", "New workflow");
      const workflowId = res.data?.id || res.data?.ID || res.id || res.ID;

      navigate(`/workflows/${workflowId}/canvas`);
    } catch (err) {
      setError(err.message || "Failed to create workflow");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchWorkflows();
  }, [navigate]);

  // Filter & Sort
  useEffect(() => {
    let result = [...workflows];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          (w.Name || w.name || "").toLowerCase().includes(q) ||
          (w.Description?.String || w.description || "").toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((w) => {
        const isActive = w.IsActive || w.is_active;
        return filterStatus === "active" ? isActive : !isActive;
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.CreatedAt || a.created_at || 0);
      const dateB = new Date(b.CreatedAt || b.created_at || 0);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredWorkflows(result);
  }, [workflows, searchQuery, filterStatus, sortBy]);

  const stats = {
    total: workflows.length,
    active: workflows.filter((w) => w.IsActive || w.is_active).length,
    inactive: workflows.filter((w) => !(w.IsActive || w.is_active)).length,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .dash-root {
          min-height: 100vh;
          background: #0a0a0f;
          color: #f0f0f5;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 32px;
        }

        .dash-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .dash-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #f0f0f5;
          margin: 0;
        }

        .dash-title span {
          color: #c8ff44;
        }

        .btn-create {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          background: #c8ff44;
          color: #0a0a0f;
          font-size: 14px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.01em;
        }

        .btn-create:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(200,255,68,0.25);
        }

        .btn-create:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-create svg {
          width: 16px;
          height: 16px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .stat-pill {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .stat-pill-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-pill-icon svg {
          width: 20px;
          height: 20px;
        }

        .stat-pill-info {
          flex: 1;
        }

        .stat-pill-value {
          font-size: 22px;
          font-weight: 800;
          color: #f0f0f5;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .stat-pill-label {
          font-size: 12px;
          color: #5a5a7a;
          margin-top: 4px;
          font-weight: 500;
        }

        .dash-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 240px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 9px 14px;
          transition: all 0.2s ease;
        }

        .search-box:focus-within {
          border-color: rgba(200,255,68,0.3);
          background: rgba(255,255,255,0.03);
          box-shadow: 0 0 0 3px rgba(200,255,68,0.06);
        }

        .search-box svg {
          width: 16px;
          height: 16px;
          color: #4a4a6a;
          flex-shrink: 0;
        }

        .search-box input {
          background: none;
          border: none;
          color: #f0f0f5;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          width: 100%;
          outline: none;
        }

        .search-box input::placeholder {
          color: #4a4a6a;
        }

        .filter-select {
          padding: 9px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          color: #8b8ba7;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
        }

        .filter-select:focus {
          border-color: rgba(200,255,68,0.3);
        }

        .filter-select option {
          background: #12121a;
          color: #f0f0f5;
        }

        .error-banner {
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

        .error-banner svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 16px;
        }

        .spinner {
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

        .loading-text {
          font-size: 14px;
          color: #5a5a7a;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: rgba(200,255,68,0.06);
          border: 1px solid rgba(200,255,68,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .empty-icon svg {
          width: 28px;
          height: 28px;
          color: #c8ff44;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 700;
          color: #e8e8f0;
          margin-bottom: 8px;
        }

        .empty-desc {
          font-size: 14px;
          color: #5a5a7a;
          max-width: 320px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 16px;
        }

        .workflow-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .workflow-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        .workflow-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
          opacity: 0.4;
        }

        .workflow-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .workflow-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #f0f0f5;
          letter-spacing: -0.01em;
          line-height: 1.3;
          word-break: break-word;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          flex-shrink: 0;
          font-family: 'JetBrains Mono', monospace;
        }

        .status-badge.active {
          background: rgba(200,255,68,0.08);
          color: #c8ff44;
          border: 1px solid rgba(200,255,68,0.15);
        }

        .status-badge.inactive {
          background: rgba(255,71,117,0.08);
          color: #ff4775;
          border: 1px solid rgba(255,71,117,0.15);
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .status-badge.active .status-dot {
          box-shadow: 0 0 6px currentColor;
          animation: pulse-dot 2s ease infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .workflow-card-desc {
          font-size: 13px;
          color: #5a5a7a;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .workflow-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .workflow-meta {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .workflow-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #4a4a6a;
          font-family: 'JetBrains Mono', monospace;
        }

        .workflow-meta-item svg {
          width: 14px;
          height: 14px;
          color: #4a4a6a;
        }

        .workflow-arrow {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.04);
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s ease;
        }

        .workflow-card:hover .workflow-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .workflow-arrow svg {
          width: 14px;
          height: 14px;
          color: #8b8ba7;
        }

        .results-count {
          font-size: 13px;
          color: #4a4a6a;
          margin-bottom: 16px;
          font-family: 'JetBrains Mono', monospace;
        }

        @media (max-width: 768px) {
          .dash-root { padding: 20px; }
          .stats-row { grid-template-columns: 1fr; }
          .dash-toolbar { flex-direction: column; align-items: stretch; }
          .search-box { min-width: auto; }
          .workflow-grid { grid-template-columns: 1fr; }
          .dash-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="dash-root">
        <div className="dash-container">
          {/* Header */}
          <div className="dash-header">
            <h1 className="dash-title">
              Your <span>Workflows</span>
            </h1>
            <button
              className="btn-create"
              onClick={handleCreateWorkflow}
              disabled={creating}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {creating ? "Creating..." : "New Workflow"}
            </button>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-pill">
              <div className="stat-pill-icon" style={{ background: 'rgba(200,255,68,0.08)', border: '1px solid rgba(200,255,68,0.12)' }}>
                <svg viewBox="0 0 24 24" fill="#c8ff44">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <div className="stat-pill-info">
                <div className="stat-pill-value">{stats.total}</div>
                <div className="stat-pill-label">Total Workflows</div>
              </div>
            </div>

            <div className="stat-pill">
              <div className="stat-pill-icon" style={{ background: 'rgba(200,255,68,0.08)', border: '1px solid rgba(200,255,68,0.12)' }}>
                <svg viewBox="0 0 24 24" fill="#c8ff44">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="stat-pill-info">
                <div className="stat-pill-value" style={{ color: '#c8ff44' }}>{stats.active}</div>
                <div className="stat-pill-label">Active</div>
              </div>
            </div>

            <div className="stat-pill">
              <div className="stat-pill-icon" style={{ background: 'rgba(255,71,117,0.08)', border: '1px solid rgba(255,71,117,0.12)' }}>
                <svg viewBox="0 0 24 24" fill="#ff4775">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
                </svg>
              </div>
              <div className="stat-pill-info">
                <div className="stat-pill-value" style={{ color: '#ff4775' }}>{stats.inactive}</div>
                <div className="stat-pill-label">Inactive</div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="dash-toolbar">
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="error-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <span className="loading-text">Loading workflows...</span>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredWorkflows.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                  <path d="M13 2v7h7" />
                </svg>
              </div>
              <div className="empty-title">
                {searchQuery || filterStatus !== "all" ? "No matching workflows" : "No workflows yet"}
              </div>
              <div className="empty-desc">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Create your first workflow to start automating tasks and connecting services."}
              </div>
              {!searchQuery && filterStatus === "all" && (
                <button className="btn-create" onClick={handleCreateWorkflow} disabled={creating}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  {creating ? "Creating..." : "Create Workflow"}
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading && filteredWorkflows.length > 0 && (
            <>
              <div className="results-count">
                Showing {filteredWorkflows.length} of {workflows.length} workflow{workflows.length !== 1 ? 's' : ''}
              </div>
              <div className="workflow-grid">
                {filteredWorkflows.map((workflow) => {
                  const workflowId = workflow.ID || workflow.id;
                  const name = workflow.Name || workflow.name || "Untitled";
                  const desc = workflow.Description?.String || workflow.description || "No description";
                  const isActive = workflow.IsActive || workflow.is_active;
                  const createdAt = workflow.CreatedAt || workflow.created_at;
                  const updatedAt = workflow.UpdatedAt || workflow.updated_at;

                  return (
                    <div
                      key={workflowId}
                      className="workflow-card"
                      style={{ '--card-accent': isActive ? '#c8ff44' : '#ff4775' }}
                      onClick={() => navigate(`/workflows/${workflowId}/canvas`)}
                    >
                      <div className="workflow-card-header">
                        <div className="workflow-card-title">{name}</div>
                        <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                          <span className="status-dot" />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="workflow-card-desc">{desc}</div>

                      <div className="workflow-card-footer">
                        <div className="workflow-meta">
                          <span className="workflow-meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <path d="M16 2v4M8 2v4M3 10h18" />
                            </svg>
                            {formatDate(createdAt)}
                          </span>
                          <span className="workflow-meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {formatTimeAgo(updatedAt)}
                          </span>
                        </div>
                        <div className="workflow-arrow">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
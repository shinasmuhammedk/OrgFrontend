import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Counter({ target }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        const frames = 40;
        let i = 0;
        const id = setInterval(() => {
            i++;
            setVal(Math.min(target, Math.round((target * i) / frames)));
            if (i >= frames) clearInterval(id);
        }, 16);
        return () => clearInterval(id);
    }, [target]);
    return <span>{val}</span>;
}

/* ── Isolated three-dot menu: manages its own state, no bubbling issues ── */
function RowMenu({ workflow, onRename, onDelete }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on outside click using native events (bypasses React bubbling)
    useEffect(() => {
        if (!open) return;
        const close = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        // Use capture phase so this fires before anything else
        document.addEventListener("click", close, true);
        return () => document.removeEventListener("click", close, true);
    }, [open]);

    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
    };

    const handleRename = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        onRename(workflow);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        onDelete(workflow);
    };

    return (
        <div
            ref={containerRef}
            style={{ position: "relative", display: "flex", alignItems: "center" }}
            // Swallow ALL click events from this cell — nothing reaches the row
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
            <button
                type="button"
                style={{ ...S.iconBtn, ...(open ? S.iconBtnActive : {}) }}
                className="m-icon-btn"
                onClick={handleButtonClick}
                title="More options"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                </svg>
            </button>

            {open && (
                <div style={S.menu}>
                    <button
                        type="button"
                        style={S.menuItem}
                        className="m-menu-item"
                        onClick={handleRename}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 8, flexShrink: 0 }}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Rename
                    </button>
                    <div style={S.menuDivider} />
                    <button
                        type="button"
                        style={{ ...S.menuItem, ...S.menuItemDanger }}
                        className="m-menu-item-danger"
                        onClick={handleDelete}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 8, flexShrink: 0 }}>
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                        </svg>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

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
    const [selectedWorkflow, setSelectedWorkflow] = useState(null);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [renameName, setRenameName] = useState("");
    const [renameDescription, setRenameDescription] = useState("");
    const [renaming, setRenaming] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [workflowName, setWorkflowName] = useState("");
    const [workflowDescription, setWorkflowDescription] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 30); }, []);

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
        } finally {
            setLoading(false);
        }
    };

    const handleRenameWorkflow = async () => {
        if (!selectedWorkflow || !renameName.trim()) return;
        try {
            setRenaming(true);
            const payload = { name: renameName.trim(), description: renameDescription.trim() || undefined };
            await api.updateWorkflow(selectedWorkflow.id || selectedWorkflow.ID, payload);
            setWorkflows((prev) =>
                prev.map((wf) =>
                    (wf.id || wf.ID) === (selectedWorkflow.id || selectedWorkflow.ID)
                        ? { ...wf, Name: payload.name, Description: { String: payload.description } }
                        : wf
                )
            );
            setShowRenameModal(false);
        } catch (err) {
            setError(err.message || "Failed to rename");
        } finally {
            setRenaming(false);
        }
    };

    const submitCreateWorkflow = async () => {
        if (!workflowName.trim()) return;
        try {
            setCreating(true);
            const payload = { name: workflowName.trim(), description: workflowDescription.trim() || undefined };
            const res = await api.createWorkflow(payload);
            const workflowId = res.data?.id || res.data?.ID || res.id || res.ID;
            setShowCreateModal(false);
            navigate(`/workflows/${workflowId}/canvas`);
        } catch (err) {
            setError(err.message || "Failed to create");
        } finally {
            setCreating(false);
        }
    };

    const openRename = useCallback((workflow) => {
        const name = workflow.Name || workflow.name || "Untitled";
        const desc = workflow.Description?.String || workflow.description || "";
        setSelectedWorkflow(workflow);
        setRenameName(name);
        setRenameDescription(desc === "—" ? "" : desc);
        setShowRenameModal(true);
    }, []);

    const handleDelete = useCallback(async (workflow) => {
        const wfId = workflow.ID || workflow.id;
        const name = workflow.Name || workflow.name || "Untitled";
        if (!window.confirm(`Delete "${name}"?`)) return;
        try {
            await api.deleteWorkflow(wfId);
            setWorkflows((p) => p.filter((w) => (w.id || w.ID) !== wfId));
        } catch (err) {
            setError(err.message || "Failed to delete");
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        fetchWorkflows();
    }, [navigate]);

    useEffect(() => {
        let result = [...workflows];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((w) =>
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
            const dA = new Date(a.CreatedAt || a.created_at || 0);
            const dB = new Date(b.CreatedAt || b.created_at || 0);
            return sortBy === "newest" ? dB - dA : dA - dB;
        });
        setFilteredWorkflows(result);
    }, [workflows, searchQuery, filterStatus, sortBy]);

    const stats = {
        total: workflows.length,
        active: workflows.filter((w) => w.IsActive || w.is_active).length,
        inactive: workflows.filter((w) => !(w.IsActive || w.is_active)).length,
    };

    const formatDate = (d) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const formatTimeAgo = (d) => {
        if (!d) return "—";
        const s = Math.floor((new Date() - new Date(d)) / 1000);
        if (s < 60) return "just now";
        const m = Math.floor(s / 60);
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        return `${Math.floor(h / 24)}d ago`;
    };

    const closeModals = () => { setShowCreateModal(false); setShowRenameModal(false); };

    return (
        <div style={S.root}>
            <style>{CSS}</style>

            {(showCreateModal || showRenameModal) && (
                <div style={S.backdrop} onClick={closeModals}>
                    <div style={S.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={S.modalTop}>
                            <span style={S.modalTitle}>
                                {showCreateModal ? "New workflow" : "Rename workflow"}
                            </span>
                            <button style={S.iconBtn} className="m-icon-btn" onClick={closeModals}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        <div style={S.modalFields}>
                            <div style={S.field}>
                                <label style={S.fieldLabel}>Name *</label>
                                <input
                                    style={S.fieldInput}
                                    className="m-input"
                                    value={showCreateModal ? workflowName : renameName}
                                    onChange={(e) => showCreateModal ? setWorkflowName(e.target.value) : setRenameName(e.target.value)}
                                    placeholder="e.g. invoice-approval"
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && (showCreateModal ? submitCreateWorkflow() : handleRenameWorkflow())}
                                />
                            </div>
                            <div style={S.field}>
                                <label style={S.fieldLabel}>Description</label>
                                <textarea
                                    style={{ ...S.fieldInput, height: 72, resize: "vertical" }}
                                    className="m-input"
                                    value={showCreateModal ? workflowDescription : renameDescription}
                                    onChange={(e) => showCreateModal ? setWorkflowDescription(e.target.value) : setRenameDescription(e.target.value)}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                        <div style={S.modalActions}>
                            <button style={S.btnSecondary} className="m-btn-secondary" onClick={closeModals}>Cancel</button>
                            <button
                                style={S.btnPrimary}
                                className="m-btn-primary"
                                onClick={showCreateModal ? submitCreateWorkflow : handleRenameWorkflow}
                                disabled={creating || renaming}
                            >
                                {creating || renaming ? "Saving..." : showCreateModal ? "Create" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={S.page} className="m-page">

                {/* Topbar */}
                <div style={{
                    ...S.topbar,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "none" : "translateY(-8px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                }}>
                    <span style={S.logo}>ORG</span>
                    <div style={S.topbarRight} className="m-topbar-right">
                        <span style={S.topbarMeta}>
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </span>
                        <button
                            style={S.btnPrimary}
                            className="m-btn-primary"
                            onClick={() => { setWorkflowName(""); setWorkflowDescription(""); setShowCreateModal(true); }}
                            disabled={creating}
                        >
                            + New workflow
                        </button>
                    </div>
                </div>

                {/* Header */}
                <div style={{
                    ...S.header,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "none" : "translateY(12px)",
                    transition: "opacity 0.5s ease 0.05s, transform 0.5s ease 0.05s",
                }}>
                    <h1 style={S.h1} className="m-h1">Workflows</h1>
                    <p style={S.subtitle}>Manage and monitor all your automations.</p>
                </div>

                {/* Stats */}
                <div style={{
                    ...S.statsRow,
                    opacity: mounted ? 1 : 0,
                    transition: "opacity 0.5s ease 0.1s",
                }} className="m-stats-row">
                    {[
                        { label: "Total", value: stats.total },
                        { label: "Active", value: stats.active },
                        { label: "Inactive", value: stats.inactive },
                    ].map((s) => (
                        <div key={s.label} style={S.statBox} className="m-stat">
                            <div style={S.statVal}>{loading ? "—" : <Counter target={s.value} />}</div>
                            <div style={S.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div style={{
                    ...S.toolbar,
                    opacity: mounted ? 1 : 0,
                    transition: "opacity 0.5s ease 0.15s",
                }}>
                    <div style={S.searchBox} className="m-search">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            style={S.searchInput}
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button style={S.clearBtn} onClick={() => setSearchQuery("")}>×</button>
                        )}
                    </div>
                    <div style={S.filters} className="m-filters">
                        {["all", "active", "inactive"].map((f) => (
                            <button
                                key={f}
                                style={{ ...S.filterBtn, ...(filterStatus === f ? S.filterBtnActive : {}) }}
                                className={filterStatus === f ? "" : "m-filter-btn"}
                                onClick={() => setFilterStatus(f)}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    <select style={S.sortSelect} className="m-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>

                {error && (
                    <div style={S.errorBar}><span style={{ fontWeight: 600 }}>Error:</span> {error}</div>
                )}

                {loading && (
                    <div style={S.center}><div className="m-spinner" /></div>
                )}

                {!loading && filteredWorkflows.length === 0 && (
                    <div style={S.empty}>
                        <div style={S.emptyTitle}>
                            {searchQuery || filterStatus !== "all" ? "No results" : "No workflows yet"}
                        </div>
                        <div style={S.emptyBody}>
                            {searchQuery || filterStatus !== "all"
                                ? "Try a different search or filter."
                                : "Create your first workflow to get started."}
                        </div>
                        {!searchQuery && filterStatus === "all" && (
                            <button
                                style={S.btnPrimary}
                                className="m-btn-primary"
                                onClick={() => { setWorkflowName(""); setWorkflowDescription(""); setShowCreateModal(true); }}
                            >
                                Create workflow
                            </button>
                        )}
                    </div>
                )}

                {!loading && filteredWorkflows.length > 0 && (
                    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}>
                        <div style={S.tableHead}>
                            <span style={{ ...S.tableHeadCell, flex: 3 }}>Name</span>
                            <span style={{ ...S.tableHeadCell, flex: 2 }}>Description</span>
                            <span style={{ ...S.tableHeadCell, flex: 1 }}>Status</span>
                            <span style={{ ...S.tableHeadCell, flex: 1.5 }}>Created</span>
                            <span style={{ ...S.tableHeadCell, flex: 1.5 }}>Updated</span>
                            <span style={{ ...S.tableHeadCell, flex: 0.5 }}></span>
                        </div>

                        {filteredWorkflows.map((workflow, idx) => {
                            const wfId = workflow.ID || workflow.id;
                            const name = workflow.Name || workflow.name || "Untitled";
                            const desc = workflow.Description?.String || workflow.description || "—";
                            const isActive = workflow.IsActive || workflow.is_active;
                            const createdAt = workflow.CreatedAt || workflow.created_at;
                            const updatedAt = workflow.UpdatedAt || workflow.updated_at;

                            return (
                                <div
                                    key={wfId}
                                    style={{ ...S.tableRow, animationDelay: `${idx * 40}ms` }}
                                    className="m-row"
                                    onClick={() => navigate(`/workflows/${wfId}/canvas`)}
                                >
                                    <span style={{ ...S.tableCell, flex: 3 }}>
                                        <span style={S.rowName}>{name}</span>
                                    </span>
                                    <span style={{ ...S.tableCell, flex: 2 }}>
                                        <span style={S.rowDesc}>{desc}</span>
                                    </span>
                                    <span style={{ ...S.tableCell, flex: 1 }}>
                                        <span style={{
                                            display: "inline-flex", alignItems: "center", gap: 5,
                                            fontSize: 11, fontWeight: 500,
                                            color: isActive ? "#111" : "#bbb",
                                        }}>
                                            <span style={{
                                                width: 5, height: 5, borderRadius: "50%",
                                                background: isActive ? "#111" : "#ddd",
                                                display: "inline-block", flexShrink: 0,
                                            }} />
                                            {isActive ? "Active" : "Inactive"}
                                        </span>
                                    </span>
                                    <span style={{ ...S.tableCell, flex: 1.5, color: "#aaa", fontSize: 12 }}>
                                        {formatDate(createdAt)}
                                    </span>
                                    <span style={{ ...S.tableCell, flex: 1.5, color: "#aaa", fontSize: 12 }}>
                                        {formatTimeAgo(updatedAt)}
                                    </span>
                                    <span style={{ ...S.tableCell, flex: 0.5, justifyContent: "flex-end", overflow: "visible" }}>
                                        <RowMenu
                                            workflow={workflow}
                                            onRename={openRename}
                                            onDelete={handleDelete}
                                        />
                                    </span>
                                </div>
                            );
                        })}

                        <div style={S.tableFooter}>
                            {filteredWorkflows.length} of {workflows.length} workflow{workflows.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;

const S = {
    root: {
        minHeight: "100vh",
        background: "#fafafa",
        color: "#111",
        fontFamily: "'Geist', 'Inter', 'Helvetica Neue', sans-serif",
    },
    page: { maxWidth: 1100, margin: "0 auto", padding: "120px 40px 80px" },
    topbar: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "28px 0 20px", marginBottom: 56, borderBottom: "1px solid #e5e5e5",
    },
    logo: {
        fontFamily: "'Geist Mono', 'DM Mono', monospace",
        fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", color: "#111",
    },
    topbarRight: { display: "flex", alignItems: "center", gap: 20 },
    topbarMeta: { fontSize: 12, color: "#999" },
    header: { marginBottom: 40 },
    h1: {
        fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700,
        letterSpacing: "-0.04em", color: "#111", margin: "0 0 8px", lineHeight: 1.1,
    },
    subtitle: { fontSize: 14, color: "#888", margin: 0, fontWeight: 400 },
    statsRow: {
        display: "flex", marginBottom: 32,
        borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #e5e5e5",
    },
    statBox: {
        flex: 1, padding: "24px 0 24px 24px",
        borderRight: "1px solid #e5e5e5",
        display: "flex", flexDirection: "column", gap: 4,
        transition: "background 0.15s", cursor: "default",
    },
    statVal: {
        fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 700,
        letterSpacing: "-0.04em", color: "#111", lineHeight: 1,
    },
    statLabel: {
        fontSize: 11, color: "#aaa", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.07em",
    },
    toolbar: {
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 4, flexWrap: "wrap", paddingTop: 16,
    },
    searchBox: {
        display: "flex", alignItems: "center", gap: 8,
        border: "1px solid #e5e5e5", borderRadius: 6,
        padding: "0 12px", height: 34, background: "#fff",
        flex: 1, minWidth: 200, maxWidth: 260, transition: "border-color 0.15s",
    },
    searchInput: {
        background: "transparent", border: "none", outline: "none",
        fontSize: 13, color: "#111", width: "100%", fontFamily: "inherit",
    },
    clearBtn: {
        background: "none", border: "none", color: "#bbb",
        cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0,
    },
    filters: {
        display: "flex", gap: 2,
        background: "#f0f0f0", borderRadius: 6, padding: 3,
    },
    filterBtn: {
        padding: "4px 12px", borderRadius: 4, border: "none",
        background: "transparent", color: "#888", fontSize: 12,
        fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "color 0.15s",
    },
    filterBtnActive: {
        background: "#fff", color: "#111", boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    },
    sortSelect: {
        border: "1px solid #e5e5e5", borderRadius: 6, padding: "0 12px",
        height: 34, fontSize: 12, color: "#555", background: "#fff",
        outline: "none", cursor: "pointer", fontFamily: "inherit",
        appearance: "none", minWidth: 100,
    },
    errorBar: {
        padding: "10px 14px", border: "1px solid #111",
        borderRadius: 6, fontSize: 13, color: "#111", marginBottom: 20,
    },
    center: { display: "flex", justifyContent: "center", padding: "80px 0" },
    empty: {
        padding: "80px 0", display: "flex", flexDirection: "column",
        alignItems: "center", gap: 10, borderTop: "1px solid #e5e5e5",
    },
    emptyTitle: { fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.02em" },
    emptyBody: { fontSize: 13, color: "#999", marginBottom: 8 },
    tableHead: {
        display: "flex", alignItems: "center",
        borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #e5e5e5",
        padding: "10px 0", marginTop: 16,
    },
    tableHeadCell: {
        fontSize: 11, fontWeight: 600, color: "#aaa",
        textTransform: "uppercase", letterSpacing: "0.07em", padding: "0 12px",
    },
    tableRow: {
        display: "flex", alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
        padding: "15px 0", cursor: "pointer", transition: "background 0.12s",
    },
    tableCell: {
        display: "flex", alignItems: "center",
        padding: "0 12px", fontSize: 13, color: "#555", overflow: "hidden",
    },
    rowName: {
        fontWeight: 600, color: "#111", letterSpacing: "-0.01em",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    },
    rowDesc: {
        color: "#bbb", overflow: "hidden", textOverflow: "ellipsis",
        whiteSpace: "nowrap", fontSize: 12,
    },
    tableFooter: {
        fontSize: 11, color: "#ccc", padding: "14px 12px 0",
        letterSpacing: "0.02em",
    },
    btnPrimary: {
        padding: "8px 16px", background: "#111", color: "#fafafa",
        border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600,
        cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em",
        transition: "opacity 0.15s", whiteSpace: "nowrap",
    },
    btnSecondary: {
        padding: "8px 16px", background: "transparent", color: "#888",
        border: "1px solid #e5e5e5", borderRadius: 6, fontSize: 13,
        fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.15s",
    },
    iconBtn: {
        background: "none", border: "none", color: "#ccc", cursor: "pointer",
        padding: "5px 6px", borderRadius: 5, display: "flex",
        alignItems: "center", justifyContent: "center",
        transition: "background 0.12s, color 0.12s",
    },
    iconBtnActive: {
        background: "#f0f0f0",
        color: "#555",
    },
    menu: {
        position: "absolute", top: "calc(100% + 6px)", right: 0,
        background: "#fff", border: "1px solid #e5e5e5", borderRadius: 8,
        padding: "4px", zIndex: 9999, minWidth: 140,
        boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
    },
    menuItem: {
        display: "flex", alignItems: "center",
        width: "100%", background: "none", border: "none",
        color: "#444", fontSize: 13, fontFamily: "inherit",
        padding: "8px 10px", borderRadius: 5, cursor: "pointer",
        textAlign: "left", transition: "background 0.1s",
    },
    menuItemDanger: {
        color: "#dc2626",
    },
    menuDivider: {
        height: 1, background: "#f0f0f0", margin: "3px 6px",
    },
    backdrop: {
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
        justifyContent: "center", zIndex: 100, padding: 20,
    },
    modal: {
        background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12,
        width: "100%", maxWidth: 400, boxShadow: "0 24px 48px rgba(0,0,0,0.08)",
        animation: "modalIn 0.2s ease", overflow: "hidden",
    },
    modalTop: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 20px 0",
    },
    modalTitle: { fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: "-0.02em" },
    modalFields: { padding: "20px 20px 0" },
    field: { marginBottom: 16 },
    fieldLabel: {
        display: "block", fontSize: 11, fontWeight: 600, color: "#aaa",
        letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
    },
    fieldInput: {
        width: "100%", border: "1px solid #e5e5e5", borderRadius: 6,
        padding: "9px 12px", fontSize: 13, fontFamily: "inherit", color: "#111",
        background: "#fafafa", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
    },
    modalActions: {
        display: "flex", justifyContent: "flex-end",
        gap: 8, padding: "16px 20px 20px",
    },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;600&display=swap');
  * { box-sizing: border-box; }
  .m-btn-primary:hover { opacity: 0.75; }
  .m-btn-secondary:hover { border-color: #bbb !important; color: #444 !important; }
  .m-row:hover { background: #f7f7f7 !important; }
  .m-icon-btn:hover { background: #f0f0f0 !important; color: #555 !important; }
  .m-stat:hover { background: #f7f7f7 !important; }
  .m-input:focus { border-color: #111 !important; background: #fff !important; }
  .m-search:focus-within { border-color: #bbb !important; }
  .m-filter-btn:hover { color: #444 !important; }
  .m-select:hover { border-color: #bbb !important; }
  .m-menu-item:hover { background: #f5f5f5 !important; }
  .m-menu-item-danger:hover { background: #fff1f1 !important; }
  .m-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 1.5px solid #e5e5e5; border-top-color: #111;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes modalIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 768px) {
    .m-table-desc, .m-table-date { display: none; }
    .m-page { padding: 90px 20px 60px !important; }
    .m-topbar { flex-direction: column; align-items: flex-start !important; gap: 16px; padding: 16px 0 !important; margin-bottom: 32px !important; }
    .m-stats-row { flex-direction: column; }
    .m-stat { border-right: none !important; border-bottom: 1px solid #e5e5e5; padding: 16px 0 16px 16px !important; }
    .m-stat:last-child { border-bottom: none; }
    .m-toolbar { flex-direction: column; align-items: stretch !important; gap: 12px; }
    .m-search { max-width: 100% !important; }
    .m-filters { justify-content: space-between; }
    .m-h1 { font-size: 1.8rem !important; }
  }
`;
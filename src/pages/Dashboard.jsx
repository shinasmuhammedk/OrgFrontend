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
    // New states for rename workflow
    const [selectedWorkflow, setSelectedWorkflow] = useState(null);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [renameName, setRenameName] = useState("");
    const [renameDescription, setRenameDescription] = useState("");
    const [renaming, setRenaming] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [workflowName, setWorkflowName] = useState("");
    const [workflowDescription, setWorkflowDescription] = useState("");

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

    const handleCreateWorkflow = () => {
        // Open the create workflow modal
        setShowCreateModal(true);
        // Reset fields
        setWorkflowName("");
        setWorkflowDescription("");
    };

    const handleRenameWorkflow = async () => {
        if (!selectedWorkflow) return;
        if (!renameName.trim()) {
            setError("Workflow name cannot be empty.");
            return;
        }
        try {
            setRenaming(true);
            setError("");
            const payload = {
                name: renameName.trim(),
                description: renameDescription.trim() || undefined,
            };
            const res = await api.updateWorkflow(selectedWorkflow.id || selectedWorkflow.ID, payload);
            // Update UI without reload
            setWorkflows((prev) =>
                prev.map((wf) =>
                    wf.id === (selectedWorkflow.id || selectedWorkflow.ID) || wf.ID === (selectedWorkflow.id || selectedWorkflow.ID)
                        ? { ...wf, Name: payload.name, Description: { String: payload.description } }
                        : wf
                )
            );
            setShowRenameModal(false);
        } catch (err) {
            setError(err.message || "Failed to rename workflow");
            console.error(err);
        } finally {
            setRenaming(false);
        }
    };

    const submitCreateWorkflow = async () => {
        if (!workflowName.trim()) {
            setError("Workflow name is required.");
            return;
        }
        try {
            setCreating(true);
            setError("");
            const payload = {
                name: workflowName.trim(),
                description: workflowDescription.trim() || undefined,
            };
            const res = await api.createWorkflow(payload);
            const workflowId = res.data?.id || res.data?.ID || res.id || res.ID;
            setShowCreateModal(false);
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
        <div className="min-h-screen bg-bg-dark text-text-primary p-6 md:p-8 mesh-bg">
            <div className="max-w-[1200px] mx-auto">

                {/* Modal for renaming a workflow */}
                {showRenameModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                        <div className="w-full max-w-md bg-bg-dark rounded-xl shadow-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold text-text-primary mb-4">Rename Workflow</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="rename-workflow-name">
                                        Name<span className="text-brand-danger ml-1">*</span>
                                    </label>
                                    <input
                                        id="rename-workflow-name"
                                        type="text"
                                        className="w-full px-3 py-2 text-sm bg-bg-panel border border-white/20 rounded focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                                        value={renameName}
                                        onChange={(e) => setRenameName(e.target.value)}
                                        placeholder="Workflow name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="rename-workflow-desc">
                                        Description
                                    </label>
                                    <textarea
                                        id="rename-workflow-desc"
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm bg-bg-panel border border-white/20 rounded focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                                        value={renameDescription}
                                        onChange={(e) => setRenameDescription(e.target.value)}
                                        placeholder="Optional description..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        className="px-4 py-2 text-sm rounded bg-bg-panel border border-white/20 text-text-muted hover:bg-bg-panel/80 transition"
                                        onClick={() => setShowRenameModal(false)}
                                        disabled={renaming}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 text-sm rounded bg-brand-primary text-bg-dark hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(200,255,68,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
                                        onClick={handleRenameWorkflow}
                                        disabled={renaming}
                                    >
                                        {renaming ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showCreateModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                        <div className="w-full max-w-md bg-bg-dark rounded-xl shadow-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold text-text-primary mb-4">Create New Workflow</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="workflow-name">Name<span className="text-brand-danger ml-1">*</span></label>
                                    <input
                                        id="workflow-name"
                                        type="text"
                                        className="w-full px-3 py-2 text-sm bg-bg-panel border border-white/20 rounded focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                                        value={workflowName}
                                        onChange={(e) => setWorkflowName(e.target.value)}
                                        placeholder="My Awesome Workflow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="workflow-desc">Description</label>
                                    <textarea
                                        id="workflow-desc"
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm bg-bg-panel border border-white/20 rounded focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                                        value={workflowDescription}
                                        onChange={(e) => setWorkflowDescription(e.target.value)}
                                        placeholder="Optional description..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        className="px-4 py-2 text-sm rounded bg-bg-panel border border-white/20 text-text-muted hover:bg-bg-panel/80 transition"
                                        onClick={() => setShowCreateModal(false)}
                                        disabled={creating}
                                    >Cancel</button>
                                    <button
                                        className="px-4 py-2 text-sm rounded bg-brand-primary text-bg-dark hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(200,255,68,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
                                        onClick={submitCreateWorkflow}
                                        disabled={creating}
                                    >
                                        {creating ? "Creating..." : "Create Workflow"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-text-primary">
                        Your <span className="text-brand-primary">Workflows</span>
                    </h1>
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-bg-dark font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(200,255,68,0.25)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        onClick={handleCreateWorkflow}
                        disabled={creating}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        {creating ? "Creating..." : "New Workflow"}
                    </button>
                </div>

                {/* Stats Bento Box */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="glass-panel p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 text-brand-primary">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-3xl font-black leading-none">{stats.total}</div>
                            <div className="text-sm text-text-muted mt-1 font-medium">Total Workflows</div>
                        </div>
                    </div>

                    <div className="glass-panel p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center shrink-0 text-brand-secondary">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-3xl font-black leading-none text-brand-secondary">{stats.active}</div>
                            <div className="text-sm text-text-muted mt-1 font-medium">Active</div>
                        </div>
                    </div>

                    <div className="glass-panel p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0 text-pink-500">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-3xl font-black leading-none text-pink-500">{stats.inactive}</div>
                            <div className="text-sm text-text-muted mt-1 font-medium">Inactive</div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                    <div className="flex-1 min-w-[240px] flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 transition-all focus-within:border-brand-primary/30 focus-within:bg-white/10 focus-within:ring-2 focus-within:ring-brand-primary/10">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-text-muted shrink-0">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search workflows..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-text-primary text-sm w-full outline-none placeholder-text-muted"
                        />
                    </div>

                    <select
                        className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary text-sm cursor-pointer outline-none transition-all hover:bg-white/10 focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 appearance-none min-w-[140px]"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all" className="bg-bg-elevated text-text-primary">All Status</option>
                        <option value="active" className="bg-bg-elevated text-text-primary">Active</option>
                        <option value="inactive" className="bg-bg-elevated text-text-primary">Inactive</option>
                    </select>

                    <select
                        className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary text-sm cursor-pointer outline-none transition-all hover:bg-white/10 focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 appearance-none min-w-[140px]"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest" className="bg-bg-elevated text-text-primary">Newest First</option>
                        <option value="oldest" className="bg-bg-elevated text-text-primary">Oldest First</option>
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2.5 p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-500 text-sm mb-6 animate-in slide-in-from-top-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4M12 16h.01" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-8 h-8 rounded-full border-2 border-brand-primary/20 border-t-brand-primary animate-spin" />
                        <span className="text-sm text-text-muted">Loading workflows...</span>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredWorkflows.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center glass-panel">
                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-5 text-brand-primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-8 h-8">
                                <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                                <path d="M13 2v7h7" />
                            </svg>
                        </div>
                        <div className="text-lg font-bold text-text-primary mb-2">
                            {searchQuery || filterStatus !== "all" ? "No matching workflows" : "No workflows yet"}
                        </div>
                        <div className="text-sm text-text-muted max-w-sm leading-relaxed mb-6">
                            {searchQuery || filterStatus !== "all"
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "Create your first workflow to start automating tasks and connecting services."}
                        </div>
                        {!searchQuery && filterStatus === "all" && (
                            <button
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-bg-dark font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(200,255,68,0.25)]"
                                onClick={handleCreateWorkflow}
                                disabled={creating}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
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
                        <div className="text-xs text-text-muted mb-4 font-mono font-medium">
                            Showing {filteredWorkflows.length} of {workflows.length} workflow{workflows.length !== 1 ? 's' : ''}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredWorkflows.map((workflow) => {
                                const workflowId = workflow.ID || workflow.id;
                                const name = workflow.Name || workflow.name || "Untitled";
                                const desc = workflow.Description?.String || workflow.description || "Add description...";
                                const isActive = workflow.IsActive || workflow.is_active;
                                const createdAt = workflow.CreatedAt || workflow.created_at;
                                const updatedAt = workflow.UpdatedAt || workflow.updated_at;

                                return (
                                    <div
                                        key={workflowId}
                                        className="glass-panel glass-panel-hover p-5 cursor-pointer flex flex-col relative overflow-hidden group"
                                        onClick={() => navigate(`/workflows/${workflowId}/canvas`)}
                                    >
                                        {/* Top gradient border accent */}
                                        <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-40 bg-gradient-to-r from-transparent via-${isActive ? 'brand-primary' : 'pink-500'} to-transparent`} />

                                        <div className="flex items-start justify-between mb-3">
                                            <div className="text-base font-bold text-text-primary tracking-tight leading-tight line-clamp-1 pr-2">
                                                {name}
                                            </div>
                                            {/* Action menu */}
                                            <div className="relative">
                                                <button
                                                    className="p-1 rounded hover:bg-white/10 transition"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMenuOpenId(menuOpenId === workflowId ? null : workflowId);
                                                    }}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5 text-text-muted">
                                                        <circle cx="12" cy="5" r="1" />
                                                        <circle cx="12" cy="12" r="1" />
                                                        <circle cx="12" cy="19" r="1" />
                                                    </svg>
                                                </button>
                                                {menuOpenId === workflowId && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-bg-dark rounded-xl shadow-xl border border-white/10 z-10">
                                                        <ul className="py-2">
                                                            <li
                                                                className="px-4 py-2 text-sm text-text-primary hover:bg-white/5 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedWorkflow(workflow);
                                                                    setRenameName(name);
                                                                    setRenameDescription(desc);
                                                                    setShowRenameModal(true);
                                                                    setMenuOpenId(null);
                                                                }}
                                                            >
                                                                Rename Workflow
                                                            </li>
                                                            <li
                                                                className="px-4 py-2 text-sm text-text-primary hover:bg-white/5 cursor-pointer"
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    const confirmed = window.confirm(
                                                                        `Are you sure you want to delete "${name}"?`
                                                                    );

                                                                    if (!confirmed) return;

                                                                    try {
                                                                        await api.deleteWorkflow(workflowId);

                                                                        setWorkflows((prev) =>
                                                                            prev.filter(
                                                                                (wf) =>
                                                                                    (wf.id || wf.ID) !== workflowId
                                                                            )
                                                                        );

                                                                        setMenuOpenId(null);
                                                                    } catch (err) {
                                                                        setError(err.message || "Failed to delete workflow");
                                                                    }
                                                                    setMenuOpenId(null);
                                                                }}
                                                            >
                                                                Delete Workflow
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-[13px] text-text-secondary leading-relaxed mb-4 line-clamp-2 flex-1">
                                            {desc}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                        <path d="M16 2v4M8 2v4M3 10h18" />
                                                    </svg>
                                                    {formatDate(createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                    {formatTimeAgo(updatedAt)}
                                                </span>
                                            </div>
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5 text-text-secondary">
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
    );
}

export default Dashboard;
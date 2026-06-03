import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, ChevronRight, ArrowLeft } from "lucide-react";
import api from "../services/api";

function WorkflowRuns() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    const fetchRuns = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/workflows/${id}/runs`);
            setRuns(response.data || []);
        } catch (err) {
            setError(err.message || "Failed to fetch runs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchRuns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString("en-US", {
            month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
        });
    };

    return (
        <div style={S.root} className="m-root">
            <style>{CSS}</style>
            <div style={S.gridBg} aria-hidden />

            <div style={{
                ...S.container,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(16px)",
                transition: "opacity 0.6s ease, transform 0.6s ease"
            }}>
                <button
                    onClick={() => navigate(`/workflows/${id}/canvas`)}
                    style={S.backBtn}
                >
                    <ArrowLeft size={16} />
                    Back to Canvas
                </button>

                <h1 style={S.title}>Workflow Runs</h1>
                <p style={S.subtitle}>View all executions of this workflow</p>

                {loading ? (
                    <div style={S.list}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="skeleton-card" />
                        ))}
                    </div>
                ) : error ? (
                    <div style={S.errorBanner}>{error}</div>
                ) : runs.length === 0 ? (
                    <div style={S.emptyState}>
                        <div style={S.emptyIcon}>
                            <FileText size={32} />
                        </div>
                        <p style={S.emptyTitle}>No runs found.</p>
                        <p style={S.emptySubtitle}>Execute your workflow to see history here.</p>
                    </div>
                ) : (
                    <div style={S.list}>
                        {runs.map((run, index) => {
                            const runId = run?.id || run?.ID || run?.workflow_run_id || `unknown-${index}`;
                            const runStatus = run?.status || run?.Status || "unknown";
                            const runDate = run?.created_at || run?.CreatedAt || new Date();
                            
                            return (
                                <div
                                    key={runId}
                                    onClick={() => navigate(`/workflow-runs/${runId}`)}
                                    className="run-card m-run-card"
                                >
                                    <div style={S.cardLeft}>
                                        <div style={S.cardIcon}>
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <div style={S.runId}>Run #{String(runId).slice(0, 8)}</div>
                                            <div style={S.runDate}>{formatDate(runDate)}</div>
                                        </div>
                                    </div>

                                    <div style={S.cardRight}>
                                        <span
                                            style={{
                                                ...S.statusBadge,
                                                ...(runStatus === "success" || runStatus === "completed"
                                                    ? { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }
                                                    : { background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" })
                                            }}
                                        >
                                            {runStatus}
                                        </span>
                                        <ChevronRight size={18} style={{ color: "#aaa" }} />
                                    </div>
                                </div>
                            );
                        })}
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
        position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "40px 0",
    },
    backBtn: {
        background: "transparent", border: "none", color: "#888", display: "flex",
        alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
        padding: 0, marginBottom: 24, transition: "color 0.2s", fontFamily: "inherit",
    },
    title: { fontSize: 28, fontWeight: 700, margin: "0 0 8px 0", color: "#111", letterSpacing: "-0.03em" },
    subtitle: { fontSize: 14, color: "#888", margin: "0 0 32px 0" },
    list: { display: "flex", flexDirection: "column", gap: 12 },
    errorBanner: {
        padding: "16px", background: "#fef2f2", color: "#ef4444",
        borderRadius: 12, border: "1px solid #fecaca", fontSize: 14, fontWeight: 500,
    },
    emptyState: {
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "80px 20px", background: "#fff", border: "1px dashed #e5e5e5", borderRadius: 16, textAlign: "center",
    },
    emptyIcon: {
        width: 64, height: 64, borderRadius: 16, background: "#fafafa",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", marginBottom: 20,
    },
    emptyTitle: { fontSize: 16, fontWeight: 700, color: "#111", margin: "0 0 8px 0" },
    emptySubtitle: { fontSize: 14, color: "#888", margin: 0 },
    cardLeft: { display: "flex", alignItems: "center", gap: 16 },
    cardIcon: {
        width: 44, height: 44, borderRadius: 10, background: "#fafafa", border: "1px solid #e5e5e5",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#888",
    },
    runId: { fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4, fontFamily: "'Geist Mono', monospace" },
    runDate: { fontSize: 12, color: "#888" },
    cardRight: { display: "flex", alignItems: "center", gap: 16 },
    statusBadge: {
        padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "'Geist Mono', monospace"
    }
};

const CSS = `
    .run-card {
        background: #fff; border: 1px solid #e5e5e5; border-radius: 16px;
        padding: 16px 20px; display: flex; justify-content: space-between;
        align-items: center; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .run-card:hover {
        border-color: #ccc;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.04);
    }
    .skeleton-card {
        height: 78px; border-radius: 16px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
        background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite;
    }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @media (max-width: 768px) {
        .m-root { padding: 90px 20px 60px !important; }
        .m-run-card { flex-direction: column; align-items: flex-start !important; gap: 16px; }
    }
`;

export default WorkflowRuns;
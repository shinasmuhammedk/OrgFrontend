import { FileText, ChevronRight } from "lucide-react";
import { T } from "../constants/workflowTheme";
import SkeletonCard from "./SkeletonCard";

const StatusBadge = ({ status }) => {
    const isSuccess = status === "success";
    const color = isSuccess ? T.success : T.danger;

    return (
        <span
            style={{
                padding: "4px 12px",
                borderRadius: 99,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                background: `${color}22`,
                color,
                border: `1px solid ${color}55`,
                fontFamily: T.fontMono,
            }}
        >
            {status}
        </span>
    );
};

function RunHistoryList({ runs, loading, navigate, formatDate }) {
    return (
        <div
            style={{
                background: T.panel,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius,
                padding: 20,
                marginTop: 24,
            }}
        >
            <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>
                Run History
            </h2>

            {loading ? (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                </>
            ) : runs.length === 0 ? (
                <p style={{ color: T.textDim, fontSize: 14 }}>
                    No runs yet. Click “Run Workflow”.
                </p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {runs.map((run) => (
                        <div
                            key={run.id || run.ID || run.run_id || run.workflow_run_id}
                            onClick={() => {
    const runId = run.id || run.ID || run.run_id || run.workflow_run_id;
    if (runId) {
        navigate(`/workflow-runs/${runId}`);
    }
}}
                            style={{
                                background: T.panel2,
                                border: `1px solid ${T.borderSoft}`,
                                borderRadius: 14,
                                padding: "14px 16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <FileText size={18} color={T.textMid} />

                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700 }}>
                                        Run #{(run.id || run.ID || run.run_id || run.workflow_run_id || "unknown").slice(0, 8)}
                                    </div>

                                    <div style={{ fontSize: 12, color: T.textDim }}>
                                        {formatDate(run.created_at || run.started_at)}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <StatusBadge status={run.status} />
                                <ChevronRight size={18} color={T.textDim} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RunHistoryList;
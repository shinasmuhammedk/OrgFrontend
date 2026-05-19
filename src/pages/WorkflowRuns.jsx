import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FileText,
    ChevronRight,
    ArrowLeft,
} from "lucide-react";

import { T } from "../features/workflow/constants/workflowTheme";
import api from "../services/api";

function WorkflowRuns() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRuns();
    }, [id]);

    const fetchRuns = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `/workflows/${id}/runs`
            );

            setRuns(response.data.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch runs"
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString();
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: T.bg,
                color: T.text,
                padding: 28,
            }}
        >
            <button
                onClick={() =>
                    navigate(`/workflows/${id}/canvas`)
                }
                style={{
                    marginBottom: 24,
                    background: "transparent",
                    color: T.textMid,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                }}
            >
                <ArrowLeft size={16} />
                Back to Canvas
            </button>

            <h1
                style={{
                    fontSize: 32,
                    marginBottom: 8,
                }}
            >
                Workflow Runs
            </h1>

            <p
                style={{
                    color: T.textDim,
                    marginBottom: 28,
                }}
            >
                View all executions of this workflow
            </p>

            {loading ? (
                <p>Loading runs...</p>
            ) : error ? (
                <p style={{ color: T.danger }}>
                    {error}
                </p>
            ) : runs.length === 0 ? (
                <p style={{ color: T.textDim }}>
                    No runs found.
                </p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    {runs.map((run) => (
                        <div
                            key={run.id}
                            onClick={() =>
                                navigate(
                                    `/workflow-runs/${run.id}`
                                )
                            }
                            style={{
                                background: T.panel,
                                border: `1px solid ${T.border}`,
                                borderRadius: 16,
                                padding: 18,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                }}
                            >
                                <FileText
                                    size={18}
                                    color={T.textMid}
                                />

                                <div>
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            marginBottom: 4,
                                        }}
                                    >
                                        Run #
                                        {run.id.slice(0, 8)}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: T.textDim,
                                        }}
                                    >
                                        {formatDate(
                                            run.created_at
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <span
                                    style={{
                                        padding:
                                            "5px 12px",
                                        borderRadius: 999,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        background:
                                            run.status ===
                                            "success"
                                                ? "rgba(34,197,94,0.15)"
                                                : "rgba(239,68,68,0.15)",
                                        color:
                                            run.status ===
                                            "success"
                                                ? T.success
                                                : T.danger,
                                    }}
                                >
                                    {run.status}
                                </span>

                                <ChevronRight
                                    size={18}
                                    color={T.textDim}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WorkflowRuns;
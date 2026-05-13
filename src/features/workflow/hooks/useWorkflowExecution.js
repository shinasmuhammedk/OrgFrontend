import { useState } from "react";
import api from "../../../services/api";
import { T } from "../constants/workflowTheme";

export function useWorkflowExecution({
    workflowId,
    nodes,
    setNodes,
    setEdges,
    fetchRuns,
    setError,
    showToast,
}) {
    const [running, setRunning] = useState(false);

    const handleRunWorkflow = async () => {
        let poller = null;

        try {
            setRunning(true);
            setError("");

            setNodes((nds) =>
                nds.map((n) => ({
                    ...n,
                    data: {
                        ...n.data,
                        status: "idle",
                    },
                }))
            );

            setEdges((eds) =>
                eds.map((e) => ({
                    ...e,
                    animated: false,
                    style: {
                        stroke: T.border,
                        strokeWidth: 2,
                    },
                }))
            );

            const runRes = await api.runWorkflow(workflowId);

            const runID =
                runRes.data?.run_id ||
                runRes.data?.runID ||
                runRes.data?.id ||
                runRes.run_id ||
                runRes.runID;

            if (!runID) {
                throw new Error("Run ID not returned from backend");
            }

            poller = setInterval(async () => {
                try {
                    const stepRes = await api.getWorkflowStepRuns(runID);
                    const stepRuns = stepRes.data || [];

                    setNodes((nds) =>
                        nds.map((node) => {
                            const stepRun = stepRuns.find(
                                (r) =>
                                    String(
                                        r.workflow_step_id ||
                                        r.WorkflowStepID
                                    ) === String(node.data.dbStepId)
                            );

                            return {
                                ...node,
                                data: {
                                    ...node.data,
                                    status: stepRun
                                        ? stepRun.status ||
                                          stepRun.Status
                                        : "idle",
                                },
                            };
                        })
                    );

                    setEdges((eds) =>
                        eds.map((edge) => {
                            const srcNode = nodes.find(
                                (n) => n.id === edge.source
                            );

                            if (!srcNode) return edge;

                            const srcRun = stepRuns.find(
                                (r) =>
                                    String(
                                        r.workflow_step_id ||
                                        r.WorkflowStepID
                                    ) ===
                                    String(srcNode.data.dbStepId)
                            );

                            const status =
                                srcRun?.status ||
                                srcRun?.Status ||
                                "idle";

                            return {
                                ...edge,
                                animated:
                                    status === "running",
                                style: {
                                    stroke:
                                        status === "running"
                                            ? T.running
                                            : status === "success"
                                            ? T.accent
                                            : status === "failed"
                                            ? T.error
                                            : T.border,
                                    strokeWidth: 2,
                                },
                            };
                        })
                    );

                    const hasFailed = stepRuns.some(
                        (r) =>
                            (r.status || r.Status) ===
                            "failed"
                    );

                    const completed = stepRuns.filter((r) =>
                        ["success", "failed"].includes(
                            r.status || r.Status
                        )
                    ).length;

                    if (
                        hasFailed ||
                        (nodes.length > 0 &&
                            completed >= nodes.length)
                    ) {
                        clearInterval(poller);
                        poller = null;

                        setRunning(false);

                        await fetchRuns();

                        showToast(
                            hasFailed
                                ? "Workflow failed"
                                : "Workflow executed successfully",
                            hasFailed
                                ? "error"
                                : "success"
                        );
                    }
                } catch (pollErr) {
                    clearInterval(poller);
                    poller = null;

                    setRunning(false);

                    setError(pollErr.message);

                    showToast(
                        pollErr.message,
                        "error"
                    );
                }
            }, 500);
        } catch (err) {
            if (poller) {
                clearInterval(poller);
            }

            setRunning(false);

            setError(err.message);

            showToast(err.message, "error");
        }
    };

    return {
        running,
        handleRunWorkflow,
    };
}
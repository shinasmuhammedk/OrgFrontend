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
    setLiveLogs,
}) {
    const [running, setRunning] = useState(false);

    const handleRunWorkflow = async () => {
        let poller = null;

        try {
            setRunning(true);
            setError("");

            if (setLiveLogs) {
                setLiveLogs([{
                    id: 'start',
                    time: new Date().toLocaleTimeString(),
                    status: 'info',
                    message: 'Workflow execution started...'
                }]);
            }

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

                    if (setLiveLogs) {
                        const logs = stepRuns.map(r => {
                            const stepNode = nodes.find(n => String(n.data.dbStepId) === String(r.workflow_step_id || r.WorkflowStepID));
                            const stepType = stepNode ? stepNode.type : 'Step';
                            return {
                                id: r.id || r.ID,
                                time: new Date(r.updated_at || r.UpdatedAt || Date.now()).toLocaleTimeString(),
                                status: r.status || r.Status,
                                message: `${stepType} ${r.status || r.Status}`
                            };
                        });
                        
                        // Preserve the initial start log and prepend new logs without duplicating the start entry
                        setLiveLogs((prev) => {
                            const startLog = prev.find((l) => l.id === "start");
                            return startLog ? [startLog, ...logs] : logs;
                        });
                    }

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

                    // Fetch the workflow runs to check the actual status of THIS run
                    const runsRes = await api.getWorkflowRuns(workflowId);
                    const allRuns = runsRes.data || [];
                    const currentRun = allRuns.find(
                        (r) => String(r.id || r.ID || r.run_id || r.RunID) === String(runID)
                    );
                    const runStatus = currentRun ? (currentRun.status || currentRun.Status) : "running";
                    const isRunCompleted = ["success", "failed", "completed"].includes(runStatus);

                    if (
                        hasFailed || isRunCompleted
                    ) {
                        clearInterval(poller);
                        poller = null;

                        setRunning(false);

                        await fetchRuns();

                        const finalFailed = hasFailed || runStatus === "failed";

                        showToast(
                            finalFailed
                                ? "Workflow failed"
                                : "Workflow executed successfully",
                            finalFailed
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
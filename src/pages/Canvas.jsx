import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import {
    Save,
    Play,
    ArrowLeft,
    AlertTriangle,
    Loader2,
} from "lucide-react";

import { nodeTypes } from "../features/workflow/nodes";
import Toast from "../features/workflow/components/Toast";
import NodeLibrary from "../features/workflow/components/NodeLibrary";
import NodeConfigPanel from "../features/workflow/components/NodeConfigPanel";
import RunHistoryList from "../features/workflow/components/RunHistoryList";
import { useWorkflowCanvas } from "../features/workflow/hooks/useWorkflowCanvas";
import { T } from "../features/workflow/constants/workflowTheme";
import { useWorkflowRuns } from "../features/workflow/hooks/useWorkflowRuns";
import { useWorkflowExecution } from "../features/workflow/hooks/useWorkflowExecution";

import { GLOBAL_WORKFLOW_STYLES } from "../features/workflow/utils/workflowStyles";

import { useToast } from "../features/workflow/hooks/useToast";
import WorkflowSchedulePanel from "../features/workflow/components/WorkflowSchedulePanel";


function Canvas() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [error, setError] = useState("");
    const [liveLogs, setLiveLogs] = useState([]);

    const {
        toast,
        showToast,
        closeToast,
    } = useToast();

    const {
        runs,
        loadingRuns,
        fetchRuns,
        formatDate,
    } = useWorkflowRuns(id, setError);

    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        selectedNode,
        setSelectedNode,
        sidebarAnimating,
        setSidebarAnimating,
        setReactFlowInstance,
        saving,
        onConnect,
        onDrop,
        onDragOver,
        onDragStart,
        updateNodeConfig,
        deleteSelectedNode,
        fetchWorkflowSteps,
        handleSaveWorkflow,
    } = useWorkflowCanvas(id, setError, showToast);

    const {
        running,
        handleRunWorkflow,
    } = useWorkflowExecution({
        workflowId: id,
        nodes,
        setNodes,
        setEdges,
        fetchRuns,
        setError,
        showToast,
    });

    const loadPageData = async () => {
        setError("");
        await fetchWorkflowSteps();
        await fetchRuns();
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        loadPageData();
    }, [id, navigate]);

    useEffect(() => {
        if (!id) return;

        const eventSource = new EventSource(
            `http://localhost:8080/workflows/${id}/events`
        );

        eventSource.addEventListener("workflow_update", (event) => {
            const data = JSON.parse(event.data);

            setLiveLogs((logs) => [
                ...logs,
                {
                    id: Date.now() + Math.random(),
                    time: new Date().toLocaleTimeString(),
                    status: data.status,
                    message: data.message || `${data.step_type || "Step"} ${data.status}`,
                },

            ]);

            console.log("sse update recieved", data)

            setNodes((currentNodes) =>
                currentNodes.map((node) =>
                    node.data.backendStepId === data.step_id
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                status: data.status,
                                error: data.error || null,
                            },
                        }
                        : node
                )
            );
        });

        eventSource.onerror = () => {
            console.log("SSE connection error");
        };

        return () => {
            eventSource.close();
        };
    }, [id, setNodes]);

    const CONFIG_W = 370;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: T.bg,
                color: T.text,
                padding: "28px 28px 40px",
                paddingRight: selectedNode ? `${CONFIG_W + 28}px` : "28px",
                transition: "padding-right 0.35s cubic-bezier(0.4,0,0.2,1)",
                fontFamily: T.fontBody,
            }}
        >
            <style>{GLOBAL_WORKFLOW_STYLES}</style>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            <button
                onClick={() => navigate("/dashboard")}
                className="btn-ghost"
                style={{
                    marginBottom: 22,
                    background: "transparent",
                    color: T.textMid,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 0",
                    fontFamily: T.fontBody,
                    fontWeight: 500,
                }}
            >
                <ArrowLeft size={16} />
                Back to Dashboard
            </button>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 28,
                    flexWrap: "wrap",
                    gap: 16,
                }}
            >
                <div>
                    <h1
                        style={{
                            color: T.text,
                            fontSize: 30,
                            fontWeight: 800,
                            margin: 0,
                            fontFamily: T.fontDisplay,
                        }}
                    >
                        Workflow Canvas
                    </h1>

                    <p
                        style={{
                            color: T.textMid,
                            fontSize: 14,
                            lineHeight: 1.5,
                        }}
                    >
                        Build, connect, save and run your automation workflow
                    </p>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                        onClick={handleSaveWorkflow}
                        disabled={saving}
                        className="btn-secondary"
                        style={{
                            background: T.surface,
                            color: T.text,
                            border: `1px solid ${T.border}`,
                            padding: "11px 18px",
                            borderRadius: T.radiusSm,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {saving ? (
                            <>
                                <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                                Saving…
                            </>
                        ) : (
                            <>
                                <Save size={15} />
                                Save Workflow
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleRunWorkflow}
                        disabled={running}
                        className="btn-primary"
                        style={{
                            background: T.accent,
                            color: "#07070d",
                            border: "none",
                            padding: "11px 20px",
                            borderRadius: T.radiusSm,
                            fontWeight: 800,
                            cursor: "pointer",
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {running ? (
                            <>
                                <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                                Running…
                            </>
                        ) : (
                            <>
                                <Play size={15} fill="currentColor" />
                                Run Workflow
                            </>
                        )}
                    </button>
                </div>
            </div>
            <div style={{ maxWidth: "520px", marginBottom: "20px" }}>
                <WorkflowSchedulePanel workflowId={id} />
            </div>
            {error && (
                <div
                    style={{
                        background: "rgba(255,92,122,0.08)",
                        border: "1px solid rgba(255,92,122,0.25)",
                        borderRadius: T.radiusSm,
                        padding: "12px 16px",
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: T.error,
                        fontSize: 14,
                        fontWeight: 500,
                    }}
                >
                    <AlertTriangle size={15} />
                    {error}
                </div>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "250px 1fr",
                    gap: 16,
                    height: 620,
                    marginBottom: 36,
                }}
            >
                <NodeLibrary onDragStart={onDragStart} />

                <div
                    style={{
                        border: `1px solid ${T.border}`,
                        borderRadius: T.radiusXl,
                        overflow: "hidden",
                        background: "#09090f",
                        position: "relative",
                    }}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={(e, node) => {
                            setSelectedNode(node);
                            setSidebarAnimating(true);
                            setTimeout(() => setSidebarAnimating(false), 350);
                        }}
                        onPaneClick={() => setSelectedNode(null)}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        defaultEdgeOptions={{
                            animated: true,
                            style: { stroke: T.accent, strokeWidth: 2 },
                        }}
                    >
                        <Background color="#1a1a28" gap={24} size={1} />
                        <Controls />
                        <MiniMap
                            style={{
                                background: T.surface,
                                border: `1px solid ${T.border}`,
                                borderRadius: T.radiusSm,
                            }}
                            nodeColor={() => T.accent}
                            maskColor="rgba(7,7,13,0.75)"
                        />

                        <Panel position="top-left" style={{ margin: 12 }}>
                            <div
                                style={{
                                    background: "rgba(14,14,24,0.85)",
                                    border: `1px solid ${T.border}`,
                                    borderRadius: T.radiusSm,
                                    padding: "7px 13px",
                                    fontSize: 11,
                                    color: T.textMid,
                                    fontFamily: T.fontMono,
                                }}
                            >
                                {nodes.length} node{nodes.length !== 1 ? "s" : ""} ·{" "}
                                {edges.length} edge{edges.length !== 1 ? "s" : ""}
                            </div>
                        </Panel>
                    </ReactFlow>
                </div>
            </div>
            <div
                style={{
                    background: T.panel,
                    border: `1px solid ${T.border}`,
                    borderRadius: T.radius,
                    padding: 18,
                    marginTop: 24,
                    marginBottom: 24,
                }}
            >
                <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
                    Live Execution Logs
                </h3>

                {liveLogs.length === 0 ? (
                    <p style={{ color: T.textDim, fontSize: 13 }}>
                        Run a workflow to see live execution logs.
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {liveLogs.map((log) => (
                            <div
                                key={log.id}
                                style={{
                                    fontFamily: T.fontMono,
                                    fontSize: 12,
                                    color:
                                        log.status === "success"
                                            ? T.success
                                            : log.status === "failed"
                                                ? T.danger
                                                : T.running,
                                    background: "rgba(255,255,255,0.03)",
                                    border: `1px solid ${T.borderSoft}`,
                                    borderRadius: 10,
                                    padding: "9px 12px",
                                }}
                            >
                                [{log.time}] {log.message}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <RunHistoryList
                runs={runs}
                loading={loadingRuns}
                navigate={navigate}
                formatDate={formatDate}
            />

            <NodeConfigPanel
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                updateNodeConfig={updateNodeConfig}
                deleteSelectedNode={deleteSelectedNode}
                sidebarAnimating={sidebarAnimating}
                configWidth={CONFIG_W}
            />
        </div>
    );
}

export default Canvas;
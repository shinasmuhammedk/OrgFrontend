import { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import {
    Save,
    Play,
    Trash2,
    ArrowLeft,
    Globe,
    X,
    AlertTriangle,
    Loader2,
    FileText,
    Webhook,
    Clock3,
    GitBranch,
    Bot,
    Layers3,
} from "lucide-react";
import api from "./service/api";

const getStatusColor = (status) => {
    if (status === "success") return "#c8ff44";
    if (status === "failed") return "#ff5c7a";
    if (status === "running") return "#fbbf24";
    return "#272738";
};

const HttpRequestNode = ({ data, selected }) => {
    const status = data.status || "idle";
    const statusColor = getStatusColor(status);

    return (
        <div
            style={{
                background: selected ? "#1a1a2e" : "#12121a",
                color: "#e4e4f0",
                border: selected ? "2px solid #c8ff44" : `1px solid ${statusColor}`,
                borderRadius: 12,
                minWidth: 220,
                transition: "all 0.2s ease",
                boxShadow:
                    status !== "idle"
                        ? `0 0 22px ${statusColor}55`
                        : selected
                            ? "0 0 20px rgba(200, 255, 68, 0.15), 0 4px 12px rgba(0,0,0,0.3)"
                            : "0 2px 8px rgba(0,0,0,0.2)",
                cursor: "pointer",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    background:
                        status !== "idle"
                            ? `${statusColor}14`
                            : selected
                                ? "rgba(200, 255, 68, 0.1)"
                                : "rgba(200, 255, 68, 0.05)",
                    padding: "10px 14px",
                    borderBottom: "1px solid #272738",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <Globe size={15} color={status === "idle" ? "#c8ff44" : statusColor} />
                <span style={{ fontSize: 13, fontWeight: 700, color: status === "idle" ? "#c8ff44" : statusColor }}>
                    HTTP Request
                </span>
            </div>

            <div style={{ padding: "12px 14px" }}>
                <div style={nodeLabelStyle}>Method</div>
                <div
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color:
                            data.config?.method === "GET"
                                ? "#4ade80"
                                : data.config?.method === "POST"
                                    ? "#60a5fa"
                                    : data.config?.method === "PUT"
                                        ? "#fbbf24"
                                        : data.config?.method === "DELETE"
                                            ? "#f87171"
                                            : "#e4e4f0",
                        marginBottom: 10,
                    }}
                >
                    {data.config?.method || "GET"}
                </div>

                <div style={nodeLabelStyle}>URL</div>
                <div
                    style={{
                        fontSize: 12,
                        color: "#e4e4f0",
                        wordBreak: "break-all",
                        lineHeight: 1.4,
                        opacity: data.config?.url ? 1 : 0.4,
                    }}
                >
                    {data.config?.url || "Not configured"}
                </div>

                <div
                    style={{
                        marginTop: 12,
                        padding: "5px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        width: "fit-content",
                        background:
                            status === "success"
                                ? "rgba(200,255,68,0.12)"
                                : status === "failed"
                                    ? "rgba(255,92,122,0.12)"
                                    : status === "running"
                                        ? "rgba(251,191,36,0.12)"
                                        : "rgba(152,152,184,0.08)",
                        color: status === "idle" ? "#9898b8" : statusColor,
                        border: `1px solid ${status === "idle" ? "#272738" : statusColor}`,
                    }}
                >
                    {status}
                </div>
            </div>

            <Handle type="target" position={Position.Left} style={handleStyle} />
            <Handle type="source" position={Position.Right} style={handleStyle} />
        </div>
    );
};

const nodeTypes = { httpRequest: HttpRequestNode };
const initialNodes = [];
const initialEdges = [];

function Canvas() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [selectedNode, setSelectedNode] = useState(null);
    const [toast, setToast] = useState(null);
    const [sidebarAnimating, setSidebarAnimating] = useState(false);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const showToast = (message, type = "success") => setToast({ message, type });

    const onConnect = useCallback(
        (params) =>
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        animated: true,
                        style: { stroke: "#c8ff44", strokeWidth: 2 },
                    },
                    eds
                )
            ),
        [setEdges]
    );

    const fetchRuns = async () => {
        try {
            const res = await api.getWorkflowRuns(id);
            setRuns(res.data || []);
            return res.data || [];
        } catch (err) {
            setError(err.message);
            return [];
        }
    };

    const applyStepRunStatuses = async (runId) => {
        const res = await api.getWorkflowStepRuns(runId);
        const stepRuns = res.data || [];

        setNodes((nds) => {
            let matchedCount = 0;

            const updatedNodes = nds.map((node, index) => {
                const nodeStepId = String(node.data.dbStepId || "");
                const nodeId = String(node.id || "");

                const stepRun =
                    stepRuns.find((run) => String(run.FrontendNodeID || run.frontend_node_id || "") === nodeId) ||
                    stepRuns.find((run) => String(run.WorkflowStepID || run.workflow_step_id || run.workflowStepID || "") === nodeStepId) ||
                    stepRuns[index];

                if (stepRun) matchedCount++;

                return {
                    ...node,
                    data: {
                        ...node.data,
                        status: stepRun ? stepRun.Status || stepRun.status || "success" : "success",
                    },
                };
            });

            return matchedCount === 0
                ? nds.map((node) => ({
                    ...node,
                    data: { ...node.data, status: "success" },
                }))
                : updatedNodes;
        });
    };

    const fetchWorkflowSteps = async () => {
        try {
            const stepsRes = await api.getWorkflowSteps(id);
            const edgesRes = await api.getWorkflowEdges(id);

            const steps = stepsRes.data || [];
            const workflowEdges = edgesRes.data || [];

            const loadedNodes = steps.map((step, index) => ({
                id: step.FrontendNodeID || step.frontend_node_id,
                type: "httpRequest",
                position: {
                    x: 250 + (index % 3) * 280,
                    y: 150 + Math.floor(index / 3) * 200,
                },
                data: {
                    label: "HTTP Request",
                    dbStepId: String(step.ID || step.id || ""),
                    status: "idle",
                    config: step.Config || step.config || {},
                },
            }));

            const loadedEdges = workflowEdges.map((edge, index) => ({
                id: edge.ID || edge.id || `edge-${index}`,
                source: edge.SourceFrontendNodeID || edge.source_frontend_node_id,
                target: edge.TargetFrontendNodeID || edge.target_frontend_node_id,
                animated: true,
                style: { stroke: "#c8ff44", strokeWidth: 2 },
            }));

            setNodes(loadedNodes);
            setEdges(loadedEdges);
        } catch (err) {
            setError(err.message);
        }
    };

    const loadPageData = async () => {
        try {
            setLoading(true);
            setError("");
            await fetchWorkflowSteps();
            await fetchRuns();
        } finally {
            setLoading(false);
        }
    };

    const updateNodeConfig = (key, value) => {
        if (!selectedNode) return;

        setNodes((nds) =>
            nds.map((node) =>
                node.id === selectedNode.id
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            config: { ...node.data.config, [key]: value },
                        },
                    }
                    : node
            )
        );
    };

    const addHttpNode = () => {
        const nodeId = `node-${Date.now()}`;

        const newNode = {
            id: nodeId,
            type: "httpRequest",
            position: {
                x: 250 + (nodes.length % 3) * 280,
                y: 150 + Math.floor(nodes.length / 3) * 200,
            },
            data: {
                label: "HTTP Request",
                status: "idle",
                config: { url: "", method: "GET", body: "" },
            },
        };

        setNodes((nds) => [...nds, newNode]);
        setSelectedNode(newNode);
        setSidebarAnimating(true);
        setTimeout(() => setSidebarAnimating(false), 300);
    };

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            if (!reactFlowInstance) return;

            const type = event.dataTransfer.getData("application/reactflow");
            if (!type) return;

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const nodeId = `node-${Date.now()}`;

            const newNode = {
                id: nodeId,
                type: "httpRequest",
                position,
                data: {
                    label: "HTTP Request",
                    status: "idle",
                    config: { url: "", method: "GET", body: "" },
                },
            };

            setNodes((nds) => nds.concat(newNode));
            setSelectedNode(newNode);
        },
        [reactFlowInstance, setNodes]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const deleteSelectedNode = () => {
        if (!selectedNode) return;

        setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
        setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
        setSelectedNode(null);
        showToast("Node deleted", "success");
    };

    const handleSaveWorkflow = async () => {
        try {
            setSaving(true);
            setError("");

            const steps = nodes.map((node, index) => ({
                frontend_node_id: node.id,
                step_order: index + 1,
                step_type: "http_request",
                config: node.data.config,
            }));

            const workflowEdges = edges.map((edge) => ({
                source: edge.source,
                target: edge.target,
            }));

            await api.saveWorkflowSteps(id, steps, workflowEdges);
            await fetchWorkflowSteps();

            showToast("Workflow saved successfully", "success");
        } catch (err) {
            setError(err.message);
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const updateNodeStatus = (nodeId, status) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            status,
                        },
                    }
                    : node
            )
        );
    };

    const updateEdgeStatus = (sourceNodeId, status) => {
        setEdges((eds) =>
            eds.map((edge) => {
                if (edge.source !== sourceNodeId) return edge;

                return {
                    ...edge,
                    animated: status === "running",
                    style: {
                        stroke:
                            status === "running"
                                ? "#fbbf24"
                                : status === "success"
                                    ? "#c8ff44"
                                    : "#ff5c7a",
                        strokeWidth: 2,
                    },
                };
            })
        );
    };

    const getOrderedNodes = () => {
        if (nodes.length === 0) return [];

        const targetIds = new Set(edges.map((edge) => edge.target));
        const startNode = nodes.find((node) => !targetIds.has(node.id)) || nodes[0];

        const ordered = [];
        const visited = new Set();

        let currentNode = startNode;

        while (currentNode && !visited.has(currentNode.id)) {
            ordered.push(currentNode);
            visited.add(currentNode.id);

            const nextEdge = edges.find((edge) => edge.source === currentNode.id);
            currentNode = nextEdge
                ? nodes.find((node) => node.id === nextEdge.target)
                : null;
        }

        nodes.forEach((node) => {
            if (!visited.has(node.id)) ordered.push(node);
        });

        return ordered;
    };

    const handleRunWorkflow = async () => {
        let poller = null;

        try {
            setRunning(true);
            setError("");

            // reset nodes
            setNodes((nds) =>
                nds.map((node) => ({
                    ...node,
                    data: { ...node.data, status: "idle" },
                }))
            );

            // reset edges
            setEdges((eds) =>
                eds.map((edge) => ({
                    ...edge,
                    animated: false,
                    style: { stroke: "#272738", strokeWidth: 2 },
                }))
            );

            // start workflow
            const runRes = await api.runWorkflow(id);

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
                                (run) =>
                                    String(run.workflow_step_id || run.WorkflowStepID) ===
                                    String(node.data.dbStepId)
                            );

                            return {
                                ...node,
                                data: {
                                    ...node.data,
                                    status: stepRun
                                        ? stepRun.status || stepRun.Status
                                        : "idle",
                                },
                            };
                        })
                    );

                    setEdges((eds) =>
                        eds.map((edge) => {
                            const sourceNode = nodes.find(
                                (node) => node.id === edge.source
                            );

                            if (!sourceNode) return edge;

                            const sourceStepRun = stepRuns.find(
                                (run) =>
                                    String(run.workflow_step_id || run.WorkflowStepID) ===
                                    String(sourceNode.data.dbStepId)
                            );

                            const status =
                                sourceStepRun?.status ||
                                sourceStepRun?.Status ||
                                "idle";

                            return {
                                ...edge,
                                animated: status === "running",
                                style: {
                                    stroke:
                                        status === "running"
                                            ? "#fbbf24"
                                            : status === "success"
                                                ? "#c8ff44"
                                                : status === "failed"
                                                    ? "#ff5c7a"
                                                    : "#272738",
                                    strokeWidth: 2,
                                },
                            };
                        })
                    );

                    const hasFailed = stepRuns.some(
                        (run) => (run.status || run.Status) === "failed"
                    );

                    const completedCount = stepRuns.filter((run) =>
                        ["success", "failed"].includes(run.status || run.Status)
                    ).length;

                    const allCompleted =
                        nodes.length > 0 && completedCount >= nodes.length;

                    if (hasFailed || allCompleted) {
                        clearInterval(poller);
                        poller = null;

                        setRunning(false);
                        await fetchRuns();

                        showToast(
                            hasFailed
                                ? "Workflow failed"
                                : "Workflow executed successfully",
                            hasFailed ? "error" : "success"
                        );
                    }
                } catch (pollErr) {
                    clearInterval(poller);
                    poller = null;

                    setRunning(false);
                    setError(pollErr.message);
                    showToast(pollErr.message, "error");
                }
            }, 500);
        } catch (err) {
            if (poller) clearInterval(poller);

            setRunning(false);
            setError(err.message);
            showToast(err.message, "error");
        }
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
        if (!selectedNode) return;

        const updated = nodes.find((n) => n.id === selectedNode.id);
        if (updated && updated !== selectedNode) {
            setSelectedNode(updated);
        }
    }, [nodes]);

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === "N/A") return "N/A";

        try {
            return new Date(dateStr).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateStr;
        }
    };

    const configWidth = 360;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "radial-gradient(circle at top left, rgba(200,255,68,0.06), transparent 30%), #09090e",
                color: "#e4e4f0",
                padding: "24px",
                paddingRight: selectedNode ? `${configWidth + 24}px` : "24px",
                transition: "padding-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
            }}
        >
            <style>{`
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                @keyframes sidebarSlide { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes spin { to { transform: rotate(360deg); } }
                .run-card:hover { border-color: #c8ff44 !important; transform: translateY(-2px); box-shadow: 0 4px 20px rgba(200, 255, 68, 0.1); }
                .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(200, 255, 68, 0.3); }
                .btn-secondary:hover { border-color: #c8ff44 !important; color: #c8ff44 !important; }
                .btn-ghost:hover { color: #c8ff44 !important; }
                .node-palette:hover { border-color: #c8ff44 !important; transform: translateY(-1px); }
            `}</style>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <button onClick={() => navigate("/dashboard")} className="btn-ghost" style={backButtonStyle}>
                <ArrowLeft size={18} />
                Back to Dashboard
            </button>

            <div style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>Workflow Canvas</h1>
                    <p style={{ color: "#9898b8", fontSize: 15, lineHeight: 1.5 }}>Build, save, run, and inspect your workflow</p>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button onClick={handleSaveWorkflow} disabled={saving} className="btn-secondary" style={secondaryButtonStyle}>
                        {saving ? (
                            <>
                                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Workflow
                            </>
                        )}
                    </button>

                    <button onClick={handleRunWorkflow} disabled={running} className="btn-primary" style={primaryButtonStyle}>
                        {running ? (
                            <>
                                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                                Running...
                            </>
                        ) : (
                            <>
                                <Play size={16} fill="currentColor" />
                                Run Workflow
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div style={errorStyle}>
                    <AlertTriangle size={16} />
                    {error}
                </div>
            )}

            <div style={builderLayoutStyle}>
                <div style={leftSidebarStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                        <Layers3 size={18} color="#c8ff44" />
                        <h3 style={{ color: "#c8ff44", fontSize: 16, fontWeight: 800, margin: 0 }}>Nodes</h3>
                    </div>

                    <button draggable onDragStart={(event) => onDragStart(event, "httpRequest")} className="node-palette" style={nodePaletteButtonStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                            <div style={activeIconBoxStyle}>
                                <Globe size={18} color="#c8ff44" />
                            </div>
                            <div>
                                <div style={paletteTitleStyle}>HTTP Request</div>
                                <div style={paletteSubStyle}>Call APIs & webhooks</div>
                            </div>
                        </div>
                        <div style={{ color: "#c8ff44", fontSize: 12, fontWeight: 700 }}>Drag into canvas →</div>
                    </button>

                    {[
                        { icon: Webhook, title: "Webhook Trigger" },
                        { icon: Clock3, title: "Delay" },
                        { icon: GitBranch, title: "Condition" },
                        { icon: Bot, title: "AI Node" },
                    ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} style={disabledPaletteStyle}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={disabledIconBoxStyle}>
                                        <Icon size={18} color="#9898b8" />
                                    </div>
                                    <div>
                                        <div style={{ color: "#d6d6e7", fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                                        <div style={{ color: "#9898b8", fontSize: 11, marginTop: 2 }}>Coming soon</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={canvasWrapperStyle}>
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
                            setTimeout(() => setSidebarAnimating(false), 300);
                        }}
                        onPaneClick={() => setSelectedNode(null)}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        attributionPosition="bottom-left"
                        defaultEdgeOptions={{
                            animated: true,
                            style: { stroke: "#c8ff44", strokeWidth: 2 },
                        }}
                    >
                        <Background color="#2b2b3d" gap={22} />
                        <Controls style={controlsStyle} />
                        <MiniMap style={miniMapStyle} nodeColor={() => "#c8ff44"} maskColor="rgba(9, 9, 14, 0.7)" />
                        <Panel position="top-left" style={{ margin: 0 }}>
                            <div style={panelCounterStyle}>
                                {nodes.length} node{nodes.length !== 1 ? "s" : ""} · {edges.length} edge{edges.length !== 1 ? "s" : ""}
                            </div>
                        </Panel>
                    </ReactFlow>
                </div>
            </div>

            <div style={runHeaderStyle}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#e4e4f0", letterSpacing: "-0.3px" }}>Run History</h2>
                {runs.length > 0 && <span style={runCountStyle}>{runs.length} run{runs.length !== 1 ? "s" : ""}</span>}
            </div>

            {loading && (
                <div style={{ display: "grid", gap: "14px" }}>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            )}

            {!loading && runs.length === 0 && (
                <div style={emptyRunsStyle}>
                    <FileText size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                    <p style={{ fontSize: 15, marginBottom: 4 }}>No runs yet</p>
                    <p style={{ fontSize: 13, opacity: 0.7 }}>Click "Run Workflow" to execute your workflow</p>
                </div>
            )}

            <div style={{ display: "grid", gap: "14px" }}>
                {runs.map((run) => (
                    <div key={run.ID || run.id} className="run-card" onClick={() => navigate(`/workflow-runs/${run.ID || run.id}`)} style={runCardStyle}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                                <StatusBadge status={run.Status || run.status || "unknown"} />
                                <span style={{ fontSize: 12, color: "#9898b8", fontFamily: "monospace" }}>#{run.ID || run.id}</span>
                            </div>

                            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                                <div>
                                    <div style={historyMetaLabel}>Started</div>
                                    <div style={historyMetaValue}>{formatDate(run.StartedAt?.Time || run.started_at)}</div>
                                </div>

                                <div>
                                    <div style={historyMetaLabel}>Finished</div>
                                    <div style={historyMetaValue}>
                                        {run.FinishedAt?.Valid
                                            ? formatDate(run.FinishedAt.Time)
                                            : run.finished_at
                                                ? formatDate(run.finished_at)
                                                : "In progress"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ color: "#9898b8", fontSize: 20 }}>→</div>
                    </div>
                ))}
            </div>

            {selectedNode && (
                <div style={{ ...configPanelStyle, width: configWidth, animation: sidebarAnimating ? "sidebarSlide 0.3s ease" : "none" }}>
                    <div style={configHeaderStyle}>
                        <div>
                            <h2 style={{ color: "#c8ff44", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Node Config</h2>
                            <p style={{ fontSize: 12, color: "#9898b8", fontFamily: "monospace" }}>{selectedNode.id}</p>
                        </div>

                        <button onClick={() => setSelectedNode(null)} style={closeButtonStyle}>
                            <X size={16} />
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                            <label style={labelStyle}>URL</label>
                            <input value={selectedNode.data.config.url || ""} onChange={(e) => updateNodeConfig("url", e.target.value)} placeholder="https://api.example.com" style={fieldStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Method</label>
                            <select value={selectedNode.data.config.method || "GET"} onChange={(e) => updateNodeConfig("method", e.target.value)} style={fieldStyle}>
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                                <option value="PATCH">PATCH</option>
                                <option value="HEAD">HEAD</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Body JSON</label>
                            <textarea
                                value={selectedNode.data.config.body || ""}
                                onChange={(e) => updateNodeConfig("body", e.target.value)}
                                placeholder='{\n  "message": "Hello"\n}'
                                style={{
                                    ...fieldStyle,
                                    height: 140,
                                    resize: "vertical",
                                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                                    lineHeight: 1.5,
                                }}
                            />
                        </div>

                        <button onClick={deleteSelectedNode} style={deleteButtonStyle}>
                            <Trash2 size={16} />
                            Delete Node
                        </button>

                        <div style={configPreviewStyle}>
                            <p style={configPreviewTitleStyle}>Current Config</p>
                            <pre style={configPreviewCodeStyle}>{JSON.stringify(selectedNode.data.config, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            style={{
                position: "fixed",
                top: 24,
                right: 24,
                zIndex: 100,
                padding: "14px 20px",
                borderRadius: 10,
                background: type === "success" ? "rgba(200, 255, 68, 0.1)" : "rgba(255, 92, 122, 0.1)",
                border: `1px solid ${type === "success" ? "#c8ff44" : "#ff5c7a"}`,
                color: type === "success" ? "#c8ff44" : "#ff5c7a",
                backdropFilter: "blur(10px)",
                animation: "slideIn 0.3s ease",
                fontWeight: 600,
                fontSize: 14,
            }}
        >
            {type === "success" ? "✓" : "✕"} {message}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const isSuccess = status === "success";

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                background: isSuccess ? "rgba(200, 255, 68, 0.1)" : "rgba(255, 92, 122, 0.1)",
                color: isSuccess ? "#c8ff44" : "#ff5c7a",
                border: `1px solid ${isSuccess ? "rgba(200, 255, 68, 0.3)" : "rgba(255, 92, 122, 0.3)"}`,
            }}
        >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: isSuccess ? "#c8ff44" : "#ff5c7a" }} />
            {status}
        </span>
    );
};

const SkeletonCard = () => (
    <div style={{ background: "#12121a", border: "1px solid #272738", borderRadius: 12, padding: 16, animation: "pulse 2s infinite" }}>
        <div style={skeletonLineLarge} />
        <div style={skeletonLineMedium} />
        <div style={skeletonLineSmall} />
    </div>
);

const nodeLabelStyle = { fontSize: 11, color: "#9898b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 };
const handleStyle = { background: "#c8ff44", border: "2px solid #12121a", width: 10, height: 10 };
const backButtonStyle = { marginBottom: "20px", background: "transparent", color: "#9898b8", border: "none", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, padding: "8px 0", transition: "color 0.2s" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: 16 };
const titleStyle = { color: "#c8ff44", marginBottom: "8px", fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px" };
const errorStyle = { background: "rgba(255, 92, 122, 0.1)", border: "1px solid rgba(255, 92, 122, 0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: 10, color: "#ff5c7a", fontSize: 14, fontWeight: 500 };
const builderLayoutStyle = { display: "grid", gridTemplateColumns: "260px 1fr", gap: 18, height: "620px", marginBottom: "32px" };
const leftSidebarStyle = { background: "#12121a", border: "1px solid #272738", borderRadius: 16, padding: 18, overflowY: "auto" };
const canvasWrapperStyle = { border: "1px solid #272738", borderRadius: 16, overflow: "hidden", background: "#0d0d14", position: "relative" };
const controlsStyle = { background: "#12121a", border: "1px solid #272738", borderRadius: 8 };
const miniMapStyle = { background: "#12121a", border: "1px solid #272738", borderRadius: 8 };
const panelCounterStyle = { background: "rgba(18, 18, 26, 0.9)", border: "1px solid #272738", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#9898b8", backdropFilter: "blur(10px)" };
const runHeaderStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" };
const runCountStyle = { fontSize: 13, color: "#9898b8", background: "#12121a", padding: "4px 12px", borderRadius: 20, border: "1px solid #272738" };
const emptyRunsStyle = { background: "#12121a", border: "1px dashed #272738", borderRadius: 12, padding: "40px", textAlign: "center", color: "#9898b8" };
const runCardStyle = { background: "#12121a", border: "1px solid #272738", borderRadius: 12, padding: "18px", cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 };
const configPanelStyle = { position: "fixed", right: 0, top: 0, height: "100vh", background: "#12121a", borderLeft: "1px solid #272738", padding: "24px", overflowY: "auto", zIndex: 20, boxShadow: "-4px 0 24px rgba(0,0,0,0.3)" };
const configHeaderStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" };
const closeButtonStyle = { background: "rgba(255, 92, 122, 0.1)", border: "1px solid rgba(255, 92, 122, 0.3)", color: "#ff5c7a", cursor: "pointer", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" };
const deleteButtonStyle = { marginTop: 8, width: "100%", background: "rgba(255, 92, 122, 0.1)", color: "#ff5c7a", border: "1px solid rgba(255, 92, 122, 0.3)", padding: "12px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 };
const configPreviewStyle = { marginTop: 8, padding: "14px", background: "#09090e", border: "1px solid #272738", borderRadius: 10 };
const configPreviewTitleStyle = { color: "#9898b8", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 };
const configPreviewCodeStyle = { whiteSpace: "pre-wrap", fontSize: 12, color: "#e4e4f0", fontFamily: '"JetBrains Mono", "Fira Code", monospace', lineHeight: 1.6, margin: 0 };
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#9898b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 };
const fieldStyle = { width: "100%", padding: "10px 12px", background: "#09090e", border: "1px solid #272738", color: "#e4e4f0", borderRadius: 8, fontSize: 14, outline: "none" };
const secondaryButtonStyle = { background: "#12121a", color: "#e4e4f0", border: "1px solid #272738", padding: "12px 18px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" };
const primaryButtonStyle = { background: "#c8ff44", color: "#09090e", border: "none", padding: "12px 20px", borderRadius: 10, fontWeight: 800, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" };
const activeIconBoxStyle = { width: 38, height: 38, borderRadius: 10, background: "rgba(200,255,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center" };
const disabledIconBoxStyle = { width: 38, height: 38, borderRadius: 10, background: "#171722", display: "flex", alignItems: "center", justifyContent: "center" };
const paletteTitleStyle = { color: "#e4e4f0", fontWeight: 700, fontSize: 14 };
const paletteSubStyle = { color: "#9898b8", fontSize: 12 };
const nodePaletteButtonStyle = { width: "100%", background: "rgba(200,255,68,0.08)", border: "1px solid rgba(200,255,68,0.25)", borderRadius: 14, padding: 16, marginBottom: 14, cursor: "pointer", textAlign: "left", transition: "all 0.2s" };
const disabledPaletteStyle = { opacity: 0.45, background: "#0d0d14", border: "1px solid #272738", borderRadius: 14, padding: 16, marginBottom: 12 };
const historyMetaLabel = { fontSize: 11, color: "#9898b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 };
const historyMetaValue = { fontSize: 13, color: "#e4e4f0" };
const skeletonLineLarge = { width: 80, height: 20, background: "#1e1e2e", borderRadius: 4, marginBottom: 12 };
const skeletonLineMedium = { width: "60%", height: 14, background: "#1e1e2e", borderRadius: 4, marginBottom: 8 };
const skeletonLineSmall = { width: "40%", height: 14, background: "#1e1e2e", borderRadius: 4 };

export default Canvas;
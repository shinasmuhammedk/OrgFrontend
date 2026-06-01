import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { AlertTriangle, Plus } from "lucide-react";

import { nodeTypes } from "../features/workflow/nodes";
import Toast from "../features/workflow/components/Toast";
import NodeLibrary from "../features/workflow/components/NodeLibrary";
import NodeConfigPanel from "../features/workflow/components/NodeConfigPanel";
import LiveLogsPanel from "../features/workflow/components/LiveLogsPanel";
import WorkflowHeader from "../features/workflow/components/WorkflowHeader";

import { useWorkflowCanvas } from "../features/workflow/hooks/useWorkflowCanvas";
import API_BASE_URL from "../config/api";
import { useWorkflowExecution } from "../features/workflow/hooks/useWorkflowExecution";
import { useWorkflowRuns } from "../features/workflow/hooks/useWorkflowRuns";
import { useToast } from "../features/workflow/hooks/useToast";
import { S, CSS } from "../styles/shared";
function Canvas() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [error, setError] = useState("");
    const [liveLogs, setLiveLogs] = useState([]);

    const { toast, showToast, closeToast } = useToast();

    const { runs, loadingRuns, fetchRuns, formatDate } = useWorkflowRuns(id, setError);

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

    const { running, handleRunWorkflow } = useWorkflowExecution({
        workflowId: id,
        nodes,
        setNodes,
        setEdges,
        fetchRuns,
        setError,
        showToast,
        setLiveLogs,
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
        const token = localStorage.getItem("token");
        const eventSource = new EventSource(`${API_BASE_URL}/workflows/${id}/events?token=${token}`);
        eventSource.addEventListener("workflow_update", (event) => {
            const data = JSON.parse(event.data);

            setLiveLogs((logs) => {
                const logId = `${data.step_id}-${data.status}`;
                if (logs.find((l) => l.id === logId)) return logs;

                let displayStatus = data.status;
                if (data.status === "running") displayStatus = "started";
                if (data.status === "success") displayStatus = "completed successfully";

                // Get the node type from current nodes if possible
                let stepType = data.step_type || "Step";

                return [
                    ...logs,
                    {
                        id: logId,
                        time: new Date().toLocaleTimeString(),
                        status: data.status,
                        message: data.message || `${stepType} ${displayStatus}`,
                    },
                ];
            });

            setNodes((currentNodes) =>
                currentNodes.map((node) =>
                    String(node.data.dbStepId) === String(data.step_id)
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
        eventSource.onerror = () => console.log("SSE connection error");
        return () => eventSource.close();
    }, [id, setNodes]);

    const CONFIG_W = 370;

    // Apply glowing and animated styles to edges, especially when running
    const styledEdges = useMemo(() => {
        return edges.map(edge => {
            // Find if source node is active
            const sourceNode = nodes.find(n => n.id === edge.source);
            const isSourceActive = sourceNode?.data?.status === "running";
            const isSourceSuccess = sourceNode?.data?.status === "success";

            let strokeColor = "rgba(255,255,255,0.2)";
            let strokeWidth = 2;
            let animationClass = "";

            if (isSourceActive) {
                strokeColor = "#8b5cf6"; // primary
                strokeWidth = 3;
                animationClass = "animate-flow-particles";
            } else if (isSourceSuccess) {
                strokeColor = "#22c55e"; // success
                strokeWidth = 2;
            }

            return {
                ...edge,
                animated: true,
                className: animationClass,
                style: {
                    ...edge.style,
                    stroke: strokeColor,
                    strokeWidth,
                    filter: isSourceActive || isSourceSuccess ? `drop-shadow(0 0 5px ${strokeColor})` : 'none'
                }
            };
        });
    }, [edges, nodes]);

    return (
        <div style={S.root} className="w-screen h-screen overflow-hidden bg-bg-dark text-text-primary relative font-sans mesh-bg">
            <style>{CSS}</style>
            {/* Top Workflow Toolbar */}
            <WorkflowHeader
                workflowName={`Workflow ${id?.slice(0, 6) || ""}`}
                handleSaveWorkflow={handleSaveWorkflow}
                saving={saving}
                handleRunWorkflow={handleRunWorkflow}
                running={running}
            />

            {/* Error Toast */}
            {error && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-brand-danger/10 border border-brand-danger/20 text-brand-danger rounded-xl shadow-[0_10px_30px_rgba(239,68,68,0.2)] animate-in slide-in-from-top-4">
                    <AlertTriangle size={16} />
                    <span className="text-sm font-bold">{error}</span>
                    <button onClick={() => setError("")} className="ml-2 hover:opacity-70 text-lg leading-none">&times;</button>
                </div>
            )}

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={closeToast} />
            )}

            {/* Floating Tool Dock */}
            <NodeLibrary onDragStart={onDragStart} />

            {/* Main Canvas Area */}
            <div
                className="w-full h-full"
                style={{ paddingRight: selectedNode ? `${CONFIG_W}px` : "0px", transition: "padding-right 0.35s cubic-bezier(0.4,0,0.2,1)" }}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={styledEdges}
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
                    fitViewOptions={{ padding: 1 }}
                    onConnect={onConnect}
                    connectionLineStyle={{
                        stroke: "#00d97e",
                        strokeWidth: 3,
                    }}
                    connectionLineType="smoothstep"
                >
                    <Background color="rgba(255,255,255,0.05)" gap={24} size={2} className="dotted-bg" />
                    <Controls className="glass-panel border-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] fill-text-primary mb-24" />

                    {/* Modern MiniMap */}
                    <MiniMap
                        className="glass-panel overflow-hidden border-white/10 mb-24"
                        nodeColor={(n) => {
                            if (n.type === "webhookTrigger") return "#f59e0b";
                            if (n.type === "httpRequest") return "#22d3ee";
                            if (n.type === "emailNode") return "#a78bfa";
                            return "#8b5cf6";
                        }}
                        maskColor="rgba(5, 8, 22, 0.7)"
                        style={{ background: 'rgba(15,23,42,0.4)', bottom: '80px' }}
                    />

                    {nodes.length === 0 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none opacity-50 select-none text-center">
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-6 text-white/20">
                                <Plus size={48} />
                            </div>
                            <h2 className="text-2xl font-black text-white/40 tracking-tight mb-2">Blank Canvas</h2>
                            <p className="text-sm text-white/30 max-w-[250px] leading-relaxed">
                                Drag and drop nodes from the floating dock on the left to start building your workflow.
                            </p>
                        </div>
                    )}
                </ReactFlow>
            </div>

            {/* Bottom Terminal */}
            <LiveLogsPanel liveLogs={liveLogs} />

            {/* Right Config Panel */}
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
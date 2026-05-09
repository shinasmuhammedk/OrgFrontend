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
    ChevronRight,
    Zap,
} from "lucide-react";
import api from "./service/api";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const T = {
    bg: "#07070d",
    surface: "#0e0e18",
    surfaceHi: "#141420",
    border: "#1e1e30",
    borderHi: "#2a2a40",
    accent: "#c8ff44",
    accentDim: "rgba(200,255,68,0.12)",
    accentGlow: "rgba(200,255,68,0.22)",
    text: "#e8e8f2",
    textMid: "#9898b8",
    textDim: "#55556a",
    success: "#c8ff44",
    error: "#ff5c7a",
    running: "#fbbf24",
    fontMono: '"JetBrains Mono", "Fira Code", monospace',
    fontDisplay: '"Cal Sans", "DM Sans", system-ui, sans-serif',
    fontBody: '"DM Sans", system-ui, sans-serif',
    radius: "14px",
    radiusSm: "8px",
    radiusXl: "20px",
};

const getStatusColor = (status) => {
    if (status === "success") return T.success;
    if (status === "failed") return T.error;
    if (status === "running") return T.running;
    return T.border;
};

/* ─────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --accent: ${T.accent};
    --accent-dim: ${T.accentDim};
    --bg: ${T.bg};
    --surface: ${T.surface};
    --border: ${T.border};
    --text: ${T.text};
    --text-mid: ${T.textMid};
    --error: ${T.error};
    --running: ${T.running};
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e1e30; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #2a2a40; }

  /* ReactFlow overrides */
  .react-flow__attribution { display: none !important; }
  .react-flow__controls { box-shadow: none !important; }
  .react-flow__controls-button {
    background: ${T.surface} !important;
    border: 1px solid ${T.border} !important;
    color: ${T.textMid} !important;
    transition: all 0.15s ease !important;
  }
  .react-flow__controls-button:hover {
    background: ${T.surfaceHi} !important;
    color: ${T.accent} !important;
    border-color: ${T.accent} !important;
  }
  .react-flow__minimap { border: 1px solid ${T.border} !important; border-radius: ${T.radius} !important; overflow: hidden; }
  .react-flow__edge-path { transition: stroke 0.3s ease; }

  /* Animations */
  @keyframes fadeUp   { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes toastIn  { from { opacity: 0; transform: translateY(-12px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes pulse    { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes shimmer  { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes glow     { 0%, 100% { box-shadow: 0 0 12px rgba(200,255,68,0.2); } 50% { box-shadow: 0 0 28px rgba(200,255,68,0.45); } }

  /* Hover utilities */
  .run-card:hover {
    border-color: rgba(200,255,68,0.4) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,255,68,0.1);
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(200,255,68,0.35);
    background: #d6ff55 !important;
  }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-secondary:hover:not(:disabled) {
    border-color: rgba(200,255,68,0.5) !important;
    color: ${T.accent} !important;
    background: ${T.accentDim} !important;
  }
  .btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-ghost:hover { color: ${T.accent} !important; }
  .node-palette:hover {
    border-color: rgba(200,255,68,0.5) !important;
    background: rgba(200,255,68,0.1) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(200,255,68,0.08);
  }
  .node-palette:active { transform: translateY(0); }
  .config-field:focus {
    border-color: rgba(200,255,68,0.5) !important;
    box-shadow: 0 0 0 3px rgba(200,255,68,0.08) !important;
    outline: none !important;
  }
  .delete-btn:hover {
    background: rgba(255,92,122,0.18) !important;
    box-shadow: 0 0 0 1px rgba(255,92,122,0.4);
  }
`;

/* ─────────────────────────────────────────
   NODE LABEL SHARED STYLE
───────────────────────────────────────── */
const nodeLabelStyle = {
    fontSize: 10,
    color: T.textDim,
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    fontWeight: 600,
    marginBottom: 4,
    fontFamily: T.fontBody,
};

const handleStyle = {
    background: T.accent,
    border: `2px solid ${T.bg}`,
    width: 10,
    height: 10,
    boxShadow: `0 0 6px ${T.accentGlow}`,
};

/* ─────────────────────────────────────────
   NODE COMPONENTS
───────────────────────────────────────── */
const nodeShell = (selected, status) => {
    const statusColor = getStatusColor(status);
    const isIdle = status === "idle";
    return {
        background: selected ? T.surfaceHi : T.surface,
        color: T.text,
        border: selected
            ? `1.5px solid ${T.accent}`
            : isIdle
                ? `1px solid ${T.border}`
                : `1px solid ${statusColor}`,
        borderRadius: T.radius,
        minWidth: 230,
        overflow: "hidden",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: selected
            ? `0 0 0 1px ${T.accentGlow}, 0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(200,255,68,0.12)`
            : isIdle
                ? "0 2px 12px rgba(0,0,0,0.3)"
                : `0 0 24px ${statusColor}33, 0 2px 12px rgba(0,0,0,0.4)`,
        cursor: "pointer",
        fontFamily: T.fontBody,
        animation: !isIdle && status === "running" ? "glow 1.5s ease-in-out infinite" : "none",
    };
};

const nodeHeaderBase = (accent = T.accent) => ({
    padding: "10px 14px",
    borderBottom: `1px solid ${T.border}`,
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: `linear-gradient(135deg, rgba(200,255,68,0.07) 0%, transparent 100%)`,
});

const NodeTag = ({ status }) => {
    if (status === "idle") return null;
    const color = getStatusColor(status);
    return (
        <div style={{
            padding: "3px 8px",
            borderRadius: 99,
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            background: `${color}18`,
            color,
            border: `1px solid ${color}44`,
            marginLeft: "auto",
            fontFamily: T.fontMono,
        }}>
            {status}
        </div>
    );
};

const HttpRequestNode = ({ data, selected }) => {
    const status = data.status || "idle";
    const methodColors = {
        GET: "#4ade80", POST: "#60a5fa",
        PUT: "#fbbf24", DELETE: "#f87171",
        PATCH: "#c084fc", HEAD: T.textMid,
    };

    return (
        <div style={nodeShell(selected, status)}>
            <div style={nodeHeaderBase()}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Globe size={14} color={T.accent} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.accent, letterSpacing: "-0.2px" }}>HTTP Request</span>
                <NodeTag status={status} />
            </div>
            <div style={{ padding: "14px 14px" }}>
                <div style={nodeLabelStyle}>Method</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: methodColors[data.config?.method] || T.text, marginBottom: 12, fontFamily: T.fontMono }}>
                    {data.config?.method || "GET"}
                </div>
                <div style={nodeLabelStyle}>URL</div>
                <div style={{ fontSize: 12, color: data.config?.url ? T.text : T.textDim, wordBreak: "break-all", lineHeight: 1.5, fontFamily: data.config?.url ? T.fontMono : T.fontBody }}>
                    {data.config?.url || "Not configured"}
                </div>
            </div>
            <Handle type="target" position={Position.Left} style={handleStyle} />
            <Handle type="source" position={Position.Right} style={handleStyle} />
        </div>
    );
};

const WebhookTriggerNode = ({ data, selected }) => {
    const status = data.status || "idle";
    return (
        <div style={nodeShell(selected, status)}>
            <div style={nodeHeaderBase()}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Webhook size={14} color={T.accent} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>Webhook Trigger</span>
                <NodeTag status={status} />
            </div>
            <div style={{ padding: "14px 14px" }}>
                <div style={nodeLabelStyle}>Endpoint URL</div>
                <div style={{ fontSize: 11, wordBreak: "break-all", color: data.config?.webhook_url ? T.text : T.textDim, lineHeight: 1.5, fontFamily: T.fontMono }}>
                    {data.config?.webhook_url || "Save workflow to generate"}
                </div>
            </div>
            <Handle type="source" position={Position.Right} style={handleStyle} />
        </div>
    );
};

const ConditionNode = ({ data, selected }) => {
    const status = data.status || "idle";
    return (
        <div style={nodeShell(selected, status)}>
            <div style={nodeHeaderBase()}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <GitBranch size={14} color={T.accent} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>Condition</span>
                <NodeTag status={status} />
            </div>
            <div style={{ padding: "14px 14px" }}>
                <div style={nodeLabelStyle}>Field</div>
                <div style={{ fontSize: 13, color: T.text, marginBottom: 10, fontFamily: T.fontMono }}>
                    {data.config?.field || <span style={{ color: T.textDim }}>Not configured</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, background: T.border, color: T.textMid, padding: "2px 8px", borderRadius: 99, fontFamily: T.fontMono }}>
                        {data.config?.operator || "equals"}
                    </span>
                    <span style={{ fontSize: 12, color: T.text }}>{data.config?.value || ""}</span>
                </div>
                <div style={{ marginTop: 14, display: "flex", gap: 6 }}>
                    {["true", "false"].map(b => (
                        <div key={b} style={{
                            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                            background: b === "true" ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                            color: b === "true" ? "#4ade80" : "#f87171",
                            border: `1px solid ${b === "true" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                            textTransform: "uppercase", letterSpacing: "0.5px",
                        }}>{b}</div>
                    ))}
                </div>
            </div>
            <Handle type="target" position={Position.Left} style={handleStyle} />
            <Handle type="source" position={Position.Right} id="true" style={{ ...handleStyle, top: "38%", background: "#4ade80" }} />
            <Handle type="source" position={Position.Right} id="false" style={{ ...handleStyle, top: "68%", background: "#f87171" }} />
        </div>
    );
};



const DelayNode = ({ data, selected }) => {
    const status = data.status || "idle";
    const statusColor = getStatusColor(status);

    return (
        <div
            style={{
                background: selected ? "#1a1a2e" : "#12121a",
                color: "#e4e4f0",
                border: selected
                    ? "2px solid #c8ff44"
                    : `1px solid ${statusColor}`,
                borderRadius: 12,
                minWidth: 220,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    background: "rgba(200,255,68,0.08)",
                    padding: "10px 14px",
                    borderBottom: "1px solid #272738",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                <Clock3 size={15} color="#c8ff44" />

                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#c8ff44",
                    }}
                >
                    Delay
                </span>
            </div>

            <div style={{ padding: "12px 14px" }}>
                <div style={nodeLabelStyle}>Duration</div>

                <div style={{ fontSize: 13 }}>
                    {data.config?.duration || 0} sec
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                style={handleStyle}
            />

            <Handle
                type="source"
                position={Position.Right}
                style={handleStyle}
            />
        </div>
    );
};

const nodeTypes = {
    httpRequest: HttpRequestNode,
    webhookTrigger: WebhookTriggerNode,
    conditionNode: ConditionNode,
    delayNode: DelayNode,
};

/* ─────────────────────────────────────────
   SMALL SHARED COMPONENTS
───────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    const ok = type === "success";
    return (
        <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 9999,
            padding: "13px 18px",
            borderRadius: T.radius,
            background: ok ? "rgba(200,255,68,0.08)" : "rgba(255,92,122,0.08)",
            border: `1px solid ${ok ? "rgba(200,255,68,0.35)" : "rgba(255,92,122,0.35)"}`,
            color: ok ? T.accent : T.error,
            backdropFilter: "blur(16px)",
            fontWeight: 600,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            fontFamily: T.fontBody,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${ok ? "rgba(200,255,68,0.08)" : "rgba(255,92,122,0.08)"}`,
            minWidth: 220,
        }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: ok ? T.accentDim : "rgba(255,92,122,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                {ok ? "✓" : "✕"}
            </div>
            {message}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const isSuccess = status === "success";
    const color = isSuccess ? T.accent : T.error;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 99,
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px",
            background: `${color}12`, color,
            border: `1px solid ${color}33`,
            fontFamily: T.fontMono,
        }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
            {status}
        </span>
    );
};

const SkeletonCard = () => (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 18 }}>
        {[80, "55%", "35%"].map((w, i) => (
            <div key={i} style={{
                width: w, height: i === 0 ? 18 : 13,
                background: "linear-gradient(90deg, #1a1a28 25%, #22223a 50%, #1a1a28 75%)",
                backgroundSize: "200% 100%",
                animation: `shimmer 1.5s ease-in-out infinite ${i * 0.15}s`,
                borderRadius: 6, marginBottom: i < 2 ? 10 : 0,
            }} />
        ))}
    </div>
);

/* ─────────────────────────────────────────
   PALETTE CARD
───────────────────────────────────────── */
const PaletteNode = ({ icon: Icon, title, sub, onDragStart, disabled }) => {
    if (disabled) return (
        <div style={{
            background: T.bg, border: `1px solid ${T.border}`,
            borderRadius: T.radius, padding: "14px 16px", marginBottom: 10, opacity: 0.45,
            display: "flex", alignItems: "center", gap: 12,
        }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={T.textDim} />
            </div>
            <div>
                <div style={{ color: T.textMid, fontWeight: 600, fontSize: 13 }}>{title}</div>
                <div style={{ color: T.textDim, fontSize: 11, marginTop: 2 }}>Coming soon</div>
            </div>
        </div>
    );

    return (
        <button draggable onDragStart={onDragStart} className="node-palette"
            style={{
                width: "100%", background: T.accentDim,
                border: `1px solid rgba(200,255,68,0.2)`,
                borderRadius: T.radius, padding: "14px 16px", marginBottom: 10,
                cursor: "grab", textAlign: "left",
                transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                display: "flex", alignItems: "center", gap: 12,
            }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(200,255,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color={T.accent} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ color: T.text, fontWeight: 700, fontSize: 13 }}>{title}</div>
                <div style={{ color: T.textMid, fontSize: 11, marginTop: 2 }}>{sub}</div>
            </div>
            <ChevronRight size={14} color={T.textDim} />
        </button>
    );
};

/* ─────────────────────────────────────────
   CONFIG FIELD
───────────────────────────────────────── */
const ConfigField = ({ label, children }) => (
    <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMid, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8, fontFamily: T.fontBody }}>
            {label}
        </label>
        {children}
    </div>
);

const fieldBase = {
    width: "100%", padding: "10px 13px",
    background: T.bg,
    border: `1px solid ${T.border}`,
    color: T.text, borderRadius: T.radiusSm,
    fontSize: 13, outline: "none",
    transition: "all 0.15s ease",
    fontFamily: T.fontBody,
};

/* ─────────────────────────────────────────
   MAIN CANVAS COMPONENT
───────────────────────────────────────── */
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

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const showToast = (message, type = "success") => setToast({ message, type });

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: T.accent, strokeWidth: 2 } }, eds)),
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
            let matched = 0;
            const updated = nds.map((node, index) => {
                const stepRun =
                    stepRuns.find(r => String(r.FrontendNodeID || r.frontend_node_id || "") === String(node.id)) ||
                    stepRuns.find(r => String(r.WorkflowStepID || r.workflow_step_id || "") === String(node.data.dbStepId)) ||
                    stepRuns[index];
                if (stepRun) matched++;
                return { ...node, data: { ...node.data, status: stepRun ? stepRun.Status || stepRun.status || "success" : "success" } };
            });
            return matched === 0 ? nds.map(n => ({ ...n, data: { ...n.data, status: "success" } })) : updated;
        });
    };

    const getConditionBranch = (edge) => {
        if (edge.ConditionBranch?.Valid) return edge.ConditionBranch.String;
        if (edge.condition_branch?.Valid) return edge.condition_branch.String;
        if (typeof edge.ConditionBranch === "string") return edge.ConditionBranch;
        if (typeof edge.condition_branch === "string") return edge.condition_branch;
        return "";
    };

    const fetchWorkflowSteps = async () => {
        try {
            const stepsRes = await api.getWorkflowSteps(id);
            const edgesRes = await api.getWorkflowEdges(id);
            const steps = stepsRes.data || [];
            const workflowEdges = edgesRes.data || [];

            const loadedNodes = steps.map((step, index) => {
                const stepType = step.StepType || step.step_type;
                return {
                    id: step.FrontendNodeID || step.frontend_node_id,
                    type:
                        stepType === "webhook_trigger"
                            ? "webhookTrigger"
                            : stepType === "condition"
                                ? "conditionNode"
                                : stepType === "delay"
                                    ? "delayNode"
                                    : "httpRequest",
                    position: { x: 250 + (index % 3) * 300, y: 150 + Math.floor(index / 3) * 220 },
                    data: {
                        label:
                            stepType === "webhook_trigger"
                                ? "Webhook Trigger"
                                : stepType === "condition"
                                    ? "Condition"
                                    : stepType === "delay"
                                        ? "Delay"
                                        : "HTTP Request",
                        dbStepId: String(step.ID || step.id || ""),
                        status: "idle",
                        config: step.Config || step.config || {},
                    },
                };
            });

            const loadedEdges = workflowEdges.map((edge, index) => {
                const branch = getConditionBranch(edge);
                return {
                    id: edge.ID || edge.id || `edge-${index}`,
                    source: edge.SourceFrontendNodeID || edge.source_frontend_node_id,
                    target: edge.TargetFrontendNodeID || edge.target_frontend_node_id,
                    sourceHandle: branch || null,
                    data: { condition_branch: branch },
                    label: branch ? branch.toUpperCase() : "",
                    animated: true,
                    style: { stroke: branch === "false" ? "#f87171" : T.accent, strokeWidth: 2 },
                };
            });

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
        setNodes((nds) => nds.map((node) => node.id === selectedNode.id
            ? { ...node, data: { ...node.data, config: { ...node.data.config, [key]: value } } }
            : node
        ));
    };

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    const onDrop = useCallback((event) => {
        event.preventDefault();
        if (!reactFlowInstance) return;
        const type = event.dataTransfer.getData("application/reactflow");
        if (!type) return;
        const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const nodeId = `node-${Date.now()}`;
        const isWebhook = type === "webhookTrigger";
        const isCondition = type === "conditionNode";
        const isDelay = type === "delayNode";
        const newNode = {
            id: nodeId, type, position,
            data: {
                label: isWebhook
                    ? "Webhook Trigger"
                    : isCondition
                        ? "Condition"
                        : isDelay
                            ? "Delay"
                            : "HTTP Request",
                status: "idle",
                config: isWebhook
                    ? {}
                    : isCondition
                        ? { field: "", operator: "equals", value: "" }
                        : isDelay
                            ? { duration: 5 }
                            : { url: "", method: "GET", body: "" },
            },
        };
        setNodes((nds) => nds.concat(newNode));
        setSelectedNode(newNode);
    }, [reactFlowInstance, setNodes]);

    const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }, []);

    const deleteSelectedNode = () => {
        if (!selectedNode) return;
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
        setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
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
                step_type:
                    node.type === "webhookTrigger"
                        ? "webhook_trigger"
                        : node.type === "conditionNode"
                            ? "condition"
                            : node.type === "delayNode"
                                ? "delay"
                                : "http_request",
                config: node.data.config,
            }));
            const workflowEdges = edges.map((edge) => ({
                source: edge.source, target: edge.target,
                condition_branch: edge.sourceHandle === "true" ? "true" : edge.sourceHandle === "false" ? "false" : "",
            }));
            await api.saveWorkflowSteps(id, steps, workflowEdges);
            await fetchWorkflowSteps();
            showToast("Workflow saved", "success");
        } catch (err) {
            setError(err.message);
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleRunWorkflow = async () => {
        let poller = null;
        try {
            setRunning(true);
            setError("");
            setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: "idle" } })));
            setEdges((eds) => eds.map((e) => ({ ...e, animated: false, style: { stroke: T.border, strokeWidth: 2 } })));

            const runRes = await api.runWorkflow(id);
            const runID = runRes.data?.run_id || runRes.data?.runID || runRes.data?.id || runRes.run_id || runRes.runID;
            if (!runID) throw new Error("Run ID not returned from backend");

            poller = setInterval(async () => {
                try {
                    const stepRes = await api.getWorkflowStepRuns(runID);
                    const stepRuns = stepRes.data || [];

                    setNodes((nds) => nds.map((node) => {
                        const stepRun = stepRuns.find(r => String(r.workflow_step_id || r.WorkflowStepID) === String(node.data.dbStepId));
                        return { ...node, data: { ...node.data, status: stepRun ? stepRun.status || stepRun.Status : "idle" } };
                    }));

                    setEdges((eds) => eds.map((edge) => {
                        const srcNode = nodes.find(n => n.id === edge.source);
                        if (!srcNode) return edge;
                        const srcRun = stepRuns.find(r => String(r.workflow_step_id || r.WorkflowStepID) === String(srcNode.data.dbStepId));
                        const s = srcRun?.status || srcRun?.Status || "idle";
                        return {
                            ...edge, animated: s === "running",
                            style: {
                                stroke: s === "running" ? T.running : s === "success" ? T.accent : s === "failed" ? T.error : T.border,
                                strokeWidth: 2,
                            },
                        };
                    }));

                    const hasFailed = stepRuns.some(r => (r.status || r.Status) === "failed");
                    const completed = stepRuns.filter(r => ["success", "failed"].includes(r.status || r.Status)).length;
                    if (hasFailed || (nodes.length > 0 && completed >= nodes.length)) {
                        clearInterval(poller); poller = null; setRunning(false);
                        await fetchRuns();
                        showToast(hasFailed ? "Workflow failed" : "Workflow executed successfully", hasFailed ? "error" : "success");
                    }
                } catch (pollErr) {
                    clearInterval(poller); poller = null; setRunning(false);
                    setError(pollErr.message); showToast(pollErr.message, "error");
                }
            }, 500);
        } catch (err) {
            if (poller) clearInterval(poller);
            setRunning(false); setError(err.message); showToast(err.message, "error");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        loadPageData();
    }, [id, navigate]);

    useEffect(() => {
        if (!selectedNode) return;
        const updated = nodes.find(n => n.id === selectedNode.id);
        if (updated && updated !== selectedNode) setSelectedNode(updated);
    }, [nodes]);

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === "N/A") return "N/A";
        try {
            return new Date(dateStr).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
        } catch { return dateStr; }
    };

    const CONFIG_W = 370;

    return (
        <div style={{
            minHeight: "100vh",
            background: T.bg,
            backgroundImage: "radial-gradient(ellipse 60% 40% at 20% 0%, rgba(200,255,68,0.04) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 80% 100%, rgba(200,255,68,0.03) 0%, transparent 50%)",
            color: T.text,
            padding: "28px 28px 40px",
            paddingRight: selectedNode ? `${CONFIG_W + 28}px` : "28px",
            transition: "padding-right 0.35s cubic-bezier(0.4,0,0.2,1)",
            fontFamily: T.fontBody,
        }}>
            <style>{GLOBAL_CSS}</style>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* ── BACK ── */}
            <button onClick={() => navigate("/dashboard")} className="btn-ghost"
                style={{ marginBottom: 22, background: "transparent", color: T.textMid, border: "none", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, padding: "6px 0", transition: "color 0.2s", fontFamily: T.fontBody, fontWeight: 500 }}>
                <ArrowLeft size={16} />
                Back to Dashboard
            </button>

            {/* ── HEADER ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                        <div style={{ width: 8, height: 32, background: T.accent, borderRadius: 4, boxShadow: `0 0 12px ${T.accentGlow}` }} />
                        <h1 style={{ color: T.text, fontSize: 30, fontWeight: 800, letterSpacing: "-0.8px", margin: 0, fontFamily: T.fontDisplay }}>
                            Workflow Canvas
                        </h1>
                    </div>
                    <p style={{ color: T.textMid, fontSize: 14, lineHeight: 1.5, marginLeft: 20 }}>Build, connect, save and run your automation workflow</p>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={handleSaveWorkflow} disabled={saving} className="btn-secondary"
                        style={{ background: T.surface, color: T.text, border: `1px solid ${T.border}`, padding: "11px 18px", borderRadius: T.radiusSm, fontWeight: 700, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", fontFamily: T.fontBody }}>
                        {saving
                            ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />Saving…</>
                            : <><Save size={15} />Save Workflow</>}
                    </button>

                    <button onClick={handleRunWorkflow} disabled={running} className="btn-primary"
                        style={{ background: T.accent, color: "#07070d", border: "none", padding: "11px 20px", borderRadius: T.radiusSm, fontWeight: 800, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", fontFamily: T.fontBody }}>
                        {running
                            ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />Running…</>
                            : <><Play size={15} fill="currentColor" />Run Workflow</>}
                    </button>
                </div>
            </div>

            {/* ── ERROR ── */}
            {error && (
                <div style={{ background: "rgba(255,92,122,0.08)", border: "1px solid rgba(255,92,122,0.25)", borderRadius: T.radiusSm, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: T.error, fontSize: 14, fontWeight: 500 }}>
                    <AlertTriangle size={15} />
                    {error}
                </div>
            )}

            {/* ── BUILDER ── */}
            <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 16, height: 620, marginBottom: 36 }}>

                {/* Left Sidebar */}
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusXl, padding: 18, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20 }}>
                        <Layers3 size={16} color={T.accent} />
                        <span style={{ color: T.accent, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.2px" }}>Node Library</span>
                    </div>

                    <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: 10 }}>Triggers</div>
                    <PaletteNode icon={Webhook} title="Webhook Trigger" sub="Start workflow externally" onDragStart={(e) => onDragStart(e, "webhookTrigger")} />

                    <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: 10, marginTop: 6 }}>Actions</div>
                    <PaletteNode icon={Globe} title="HTTP Request" sub="Call APIs & endpoints" onDragStart={(e) => onDragStart(e, "httpRequest")} />

                    <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: 10, marginTop: 6 }}>Logic</div>
                    <PaletteNode icon={GitBranch} title="Condition" sub="Branch workflow logic" onDragStart={(e) => onDragStart(e, "conditionNode")} />

                    <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: 10, marginTop: 6 }}>Coming Soon</div>
                    <PaletteNode
                        icon={Clock3}
                        title="Delay"
                        sub="Wait before continuing"
                        onDragStart={(e) => onDragStart(e, "delayNode")}
                    />
                    <PaletteNode icon={Bot} title="AI Node" sub="LLM-powered step" disabled />

                    <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${T.border}`, fontSize: 11, color: T.textDim, textAlign: "center", lineHeight: 1.5 }}>
                        <Zap size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle", color: T.accent }} />
                        Drag nodes onto the canvas
                    </div>
                </div>

                {/* Canvas */}
                <div style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusXl, overflow: "hidden", background: "#09090f", position: "relative" }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={(e, node) => { setSelectedNode(node); setSidebarAnimating(true); setTimeout(() => setSidebarAnimating(false), 350); }}
                        onPaneClick={() => setSelectedNode(null)}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        defaultEdgeOptions={{ animated: true, style: { stroke: T.accent, strokeWidth: 2 } }}
                    >
                        <Background color="#1a1a28" gap={24} size={1} />
                        <Controls style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, boxShadow: "none" }} />
                        <MiniMap style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusSm }} nodeColor={() => T.accent} maskColor="rgba(7,7,13,0.75)" />
                        <Panel position="top-left" style={{ margin: 12 }}>
                            <div style={{ background: "rgba(14,14,24,0.85)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "7px 13px", fontSize: 11, color: T.textMid, backdropFilter: "blur(12px)", fontFamily: T.fontMono }}>
                                {nodes.length} node{nodes.length !== 1 ? "s" : ""} · {edges.length} edge{edges.length !== 1 ? "s" : ""}
                            </div>
                        </Panel>
                    </ReactFlow>
                </div>
            </div>

            {/* ── RUN HISTORY ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 4, height: 20, background: T.accent, borderRadius: 2 }} />
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: "-0.4px", margin: 0, fontFamily: T.fontDisplay }}>Run History</h2>
                </div>
                {runs.length > 0 && (
                    <span style={{ fontSize: 12, color: T.textMid, background: T.surface, padding: "4px 12px", borderRadius: 99, border: `1px solid ${T.border}`, fontFamily: T.fontMono }}>
                        {runs.length} run{runs.length !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {loading && (
                <div style={{ display: "grid", gap: 12 }}>
                    <SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
            )}

            {!loading && runs.length === 0 && (
                <div style={{ background: T.surface, border: `1px dashed ${T.border}`, borderRadius: T.radius, padding: "48px 24px", textAlign: "center", color: T.textMid, animation: "fadeUp 0.4s ease" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: T.bg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <FileText size={22} color={T.textDim} />
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: T.text }}>No runs yet</p>
                    <p style={{ fontSize: 13, color: T.textDim }}>Click "Run Workflow" to execute and see results here</p>
                </div>
            )}

            <div style={{ display: "grid", gap: 10 }}>
                {runs.map((run, i) => (
                    <div key={run.ID || run.id} className="run-card"
                        onClick={() => navigate(`/workflow-runs/${run.ID || run.id}`)}
                        style={{
                            background: T.surface, border: `1px solid ${T.border}`,
                            borderRadius: T.radius, padding: "18px 20px",
                            cursor: "pointer", transition: "all 0.2s ease",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            flexWrap: "wrap", gap: 16,
                            animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
                        }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                <StatusBadge status={run.Status || run.status || "unknown"} />
                                <span style={{ fontSize: 11, color: T.textDim, fontFamily: T.fontMono }}>#{run.ID || run.id}</span>
                            </div>
                            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                                {[
                                    ["Started", formatDate(run.StartedAt?.Time || run.started_at)],
                                    ["Finished", run.FinishedAt?.Valid ? formatDate(run.FinishedAt.Time) : run.finished_at ? formatDate(run.finished_at) : "In progress"],
                                ].map(([label, val]) => (
                                    <div key={label}>
                                        <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginBottom: 3 }}>{label}</div>
                                        <div style={{ fontSize: 13, color: T.text }}>{val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <ChevronRight size={16} color={T.textDim} />
                    </div>
                ))}
            </div>

            {/* ── CONFIG PANEL ── */}
            {selectedNode && (
                <div style={{
                    position: "fixed", right: 0, top: 0,
                    height: "100vh", width: CONFIG_W,
                    background: T.surface,
                    borderLeft: `1px solid ${T.border}`,
                    padding: "24px 22px",
                    overflowY: "auto", zIndex: 20,
                    boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
                    animation: sidebarAnimating ? "slideRight 0.35s cubic-bezier(0.34,1.2,0.64,1)" : "none",
                    display: "flex", flexDirection: "column", gap: 16,
                }}>
                    {/* Panel Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <div style={{ width: 3, height: 18, background: T.accent, borderRadius: 2 }} />
                                <h2 style={{ color: T.text, fontSize: 17, fontWeight: 800, margin: 0, fontFamily: T.fontDisplay }}>Node Config</h2>
                            </div>
                            <div style={{ fontSize: 10, color: T.textDim, fontFamily: T.fontMono, paddingLeft: 11 }}>{selectedNode.id}</div>
                        </div>
                        <button onClick={() => setSelectedNode(null)}
                            style={{ background: "rgba(255,92,122,0.08)", border: "1px solid rgba(255,92,122,0.25)", color: T.error, cursor: "pointer", width: 32, height: 32, borderRadius: T.radiusSm, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                            <X size={14} />
                        </button>
                    </div>

                    {/* Type Badge */}
                    <div style={{ background: T.accentDim, border: "1px solid rgba(200,255,68,0.2)", borderRadius: T.radiusSm, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                        {selectedNode.type === "httpRequest" && <Globe size={15} color={T.accent} />}
                        {selectedNode.type === "webhookTrigger" && <Webhook size={15} color={T.accent} />}
                        {selectedNode.type === "conditionNode" && <GitBranch size={15} color={T.accent} />}
                        {selectedNode.type === "delayNode" && <Clock3 size={15} color={T.accent} />}
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>
                            {selectedNode.type === "httpRequest"
                                ? "HTTP Request"
                                : selectedNode.type === "webhookTrigger"
                                    ? "Webhook Trigger"
                                    : selectedNode.type === "conditionNode"
                                        ? "Condition"
                                        : "Delay"}
                        </span>
                    </div>

                    {/* HTTP Config */}
                    {selectedNode.type === "httpRequest" && (
                        <>
                            <ConfigField label="URL">
                                <input value={selectedNode.data.config.url || ""} onChange={e => updateNodeConfig("url", e.target.value)}
                                    placeholder="https://api.example.com/endpoint"
                                    className="config-field" style={{ ...fieldBase }} />
                            </ConfigField>
                            <ConfigField label="Method">
                                <select value={selectedNode.data.config.method || "GET"} onChange={e => updateNodeConfig("method", e.target.value)}
                                    className="config-field" style={{ ...fieldBase }}>
                                    {["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"].map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </ConfigField>
                            <ConfigField label="Body JSON">
                                <textarea value={selectedNode.data.config.body || ""} onChange={e => updateNodeConfig("body", e.target.value)}
                                    placeholder={'{\n  "key": "value"\n}'}
                                    className="config-field"
                                    style={{ ...fieldBase, height: 140, resize: "vertical", fontFamily: T.fontMono, lineHeight: 1.6, fontSize: 12 }} />
                            </ConfigField>
                        </>
                    )}

                    {/* Condition Config */}
                    {selectedNode.type === "conditionNode" && (
                        <>
                            <ConfigField label="Field">
                                <input value={selectedNode.data.config.field || ""} onChange={e => updateNodeConfig("field", e.target.value)}
                                    placeholder="response.status" className="config-field" style={{ ...fieldBase }} />
                            </ConfigField>
                            <ConfigField label="Operator">
                                <select value={selectedNode.data.config.operator || "equals"} onChange={e => updateNodeConfig("operator", e.target.value)}
                                    className="config-field" style={{ ...fieldBase }}>
                                    <option value="equals">Equals</option>
                                    <option value="not_equals">Not Equals</option>
                                </select>
                            </ConfigField>
                            <ConfigField label="Value">
                                <input value={selectedNode.data.config.value || ""} onChange={e => updateNodeConfig("value", e.target.value)}
                                    placeholder="active" className="config-field" style={{ ...fieldBase }} />
                            </ConfigField>
                        </>
                    )}


                    {selectedNode.type === "delayNode" && (
                        <ConfigField label="Duration (seconds)">
                            <input
                                type="number"
                                value={selectedNode.data.config.duration || 0}
                                onChange={(e) =>
                                    updateNodeConfig("duration", Number(e.target.value))
                                }
                                className="config-field"
                                style={{ ...fieldBase }}
                            />
                        </ConfigField>
                    )}

                    {/* Delete */}
                    <button onClick={deleteSelectedNode} className="delete-btn"
                        style={{ width: "100%", background: "rgba(255,92,122,0.08)", color: T.error, border: "1px solid rgba(255,92,122,0.25)", padding: "12px", borderRadius: T.radiusSm, fontWeight: 700, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s", fontFamily: T.fontBody }}>
                        <Trash2 size={14} />
                        Delete Node
                    </button>

                    {/* Config Preview */}
                    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "14px" }}>
                        <div style={{ fontSize: 10, color: T.textDim, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Live Config Preview</div>
                        <pre style={{ whiteSpace: "pre-wrap", fontSize: 11, color: T.textMid, fontFamily: T.fontMono, lineHeight: 1.7, margin: 0 }}>
                            {JSON.stringify(selectedNode.data.config, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Canvas;
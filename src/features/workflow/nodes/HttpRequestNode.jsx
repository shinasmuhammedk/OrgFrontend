import { Handle, Position } from "reactflow";
import { Globe } from "lucide-react";
import {
    T,
    nodeShell,
    nodeHeaderBase,
    nodeLabelStyle,
    handleStyle,
} from "../constants/workflowTheme";
import NodeTag from "../components/NodeTag";

const HttpRequestNode = ({ data, selected }) => {
    const status = data.status || "idle";

    const methodColors = {
        GET: "#4ade80",
        POST: "#60a5fa",
        PUT: "#fbbf24",
        DELETE: "#f87171",
        PATCH: "#c084fc",
        HEAD: T.textMid,
    };

    return (
        <div style={nodeShell(selected, status)}>
            <div style={nodeHeaderBase()}>
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: T.accentDim,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Globe size={14} color={T.accent} />
                </div>

                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.accent,
                        letterSpacing: "-0.2px",
                    }}
                >
                    HTTP Request
                </span>

                <NodeTag status={status} />
            </div>

            <div style={{ padding: "14px 14px" }}>
                <div style={nodeLabelStyle}>Method</div>

                <div
                    style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: methodColors[data.config?.method] || T.text,
                        marginBottom: 12,
                        fontFamily: T.fontMono,
                    }}
                >
                    {data.config?.method || "GET"}
                </div>

                <div style={nodeLabelStyle}>URL</div>

                <div
                    style={{
                        fontSize: 12,
                        color: data.config?.url ? T.text : T.textDim,
                        wordBreak: "break-all",
                        lineHeight: 1.5,
                        fontFamily: data.config?.url ? T.fontMono : T.fontBody,
                    }}
                >
                    {data.config?.url || "Not configured"}
                </div>
            </div>

            <Handle type="target" position={Position.Left} style={handleStyle} />
            <Handle type="source" position={Position.Right} style={handleStyle} />
        </div>
    );
};

export default HttpRequestNode;
import { Handle, Position } from "reactflow";
import { GitBranch } from "lucide-react";

import {
    T,
    nodeShell,
    nodeHeaderBase,
    nodeLabelStyle,
    handleStyle,
} from "../constants/workflowTheme";

import NodeTag from "../components/NodeTag";

const ConditionNode = ({ data, selected }) => {
    const status = data.status || "idle";

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
                    <GitBranch size={14} color={T.accent} />
                </div>

                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.accent,
                    }}
                >
                    Condition
                </span>

                <NodeTag status={status} />
            </div>

            <div style={{ padding: "14px 14px" }}>
                <div style={nodeLabelStyle}>Field</div>

                <div
                    style={{
                        fontSize: 13,
                        color: T.text,
                        marginBottom: 10,
                        fontFamily: T.fontMono,
                    }}
                >
                    {data.config?.field || (
                        <span style={{ color: T.textDim }}>
                            Not configured
                        </span>
                    )}
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <span
                        style={{
                            fontSize: 11,
                            background: T.border,
                            color: T.textMid,
                            padding: "2px 8px",
                            borderRadius: 99,
                            fontFamily: T.fontMono,
                        }}
                    >
                        {data.config?.operator || "equals"}
                    </span>

                    <span
                        style={{
                            fontSize: 12,
                            color: T.text,
                        }}
                    >
                        {data.config?.value || ""}
                    </span>
                </div>

                <div
                    style={{
                        marginTop: 14,
                        display: "flex",
                        gap: 6,
                    }}
                >
                    {["true", "false"].map((b) => (
                        <div
                            key={b}
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "3px 10px",
                                borderRadius: 99,
                                background:
                                    b === "true"
                                        ? "rgba(74,222,128,0.1)"
                                        : "rgba(248,113,113,0.1)",
                                color:
                                    b === "true"
                                        ? "#4ade80"
                                        : "#f87171",
                                border: `1px solid ${
                                    b === "true"
                                        ? "rgba(74,222,128,0.3)"
                                        : "rgba(248,113,113,0.3)"
                                }`,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            }}
                        >
                            {b}
                        </div>
                    ))}
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
                id="true"
                style={{
                    ...handleStyle,
                    top: "38%",
                    background: "#4ade80",
                }}
            />

            <Handle
                type="source"
                position={Position.Right}
                id="false"
                style={{
                    ...handleStyle,
                    top: "68%",
                    background: "#f87171",
                }}
            />
        </div>
    );
};

export default ConditionNode;
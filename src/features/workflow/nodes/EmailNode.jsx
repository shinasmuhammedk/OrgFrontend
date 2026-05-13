import { Handle, Position } from "reactflow";
import { Mail } from "lucide-react";

import {
    T,
    nodeShell,
    nodeHeaderBase,
    nodeLabelStyle,
    handleStyle,
} from "../constants/workflowTheme";

import NodeTag from "../components/NodeTag";

const EmailNode = ({ data, selected }) => {
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
                    <Mail size={14} color={T.accent} />
                </div>

                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.accent,
                    }}
                >
                    Email
                </span>

                <NodeTag status={status} />
            </div>

            <div style={{ padding: "14px 14px" }}>
                <div style={nodeLabelStyle}>To</div>

                <div
                    style={{
                        fontSize: 12,
                        color: data.config?.to
                            ? T.text
                            : T.textDim,
                        wordBreak: "break-all",
                        marginBottom: 12,
                    }}
                >
                    {data.config?.to || "Not configured"}
                </div>

                <div style={nodeLabelStyle}>Subject</div>

                <div
                    style={{
                        fontSize: 12,
                        color: data.config?.subject
                            ? T.text
                            : T.textDim,
                    }}
                >
                    {data.config?.subject || "No subject"}
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

export default EmailNode;
import { Handle, Position } from "reactflow";
import { Webhook } from "lucide-react";

import {
    T,
    nodeShell,
    nodeHeaderBase,
    nodeLabelStyle,
    handleStyle,
} from "../constants/workflowTheme";

import NodeTag from "../components/NodeTag";

const WebhookTriggerNode = ({ data, selected }) => {
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
                    <Webhook size={14} color={T.accent} />
                </div>

                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.accent,
                    }}
                >
                    Webhook Trigger
                </span>

                <NodeTag status={status} />
            </div>

            <div style={{ padding: "14px 14px" }}>
                <div style={nodeLabelStyle}>Endpoint URL</div>

                <div
                    style={{
                        fontSize: 11,
                        wordBreak: "break-all",
                        color: data.config?.webhook_url
                            ? T.text
                            : T.textDim,
                        lineHeight: 1.5,
                        fontFamily: T.fontMono,
                    }}
                >
                    {data.config?.webhook_url ||
                        "Save workflow to generate"}
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                style={handleStyle}
            />
        </div>
    );
};

export default WebhookTriggerNode;
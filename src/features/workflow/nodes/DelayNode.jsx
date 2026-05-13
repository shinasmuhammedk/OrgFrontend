import { Handle, Position } from "reactflow";
import { Clock3 } from "lucide-react";

import {
    T,
    handleStyle,
    nodeLabelStyle,
} from "../constants/workflowTheme";

const getStatusColor = (status) => {
    if (status === "success") return T.success;
    if (status === "failed") return T.danger;
    if (status === "running") return T.running;

    return T.border;
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

export default DelayNode;
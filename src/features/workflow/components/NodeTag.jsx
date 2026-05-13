import { T } from "../constants/workflowTheme";

const statusMap = {
    idle: { label: "Idle", color: T.textDim },
    running: { label: "Running", color: T.running },
    success: { label: "Success", color: T.success },
    error: { label: "Error", color: T.danger },
};

const NodeTag = ({ status = "idle" }) => {
    const current = statusMap[status] || statusMap.idle;

    return (
        <div
            style={{
                marginLeft: "auto",
                fontSize: 10,
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: 999,
                background: `${current.color}22`,
                color: current.color,
                border: `1px solid ${current.color}44`,
            }}
        >
            {current.label}
        </div>
    );
};

export default NodeTag;
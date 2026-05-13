// src/features/workflow/components/NodeConfigPanel.jsx
import { X, Globe, Webhook, GitBranch, Clock3, Trash2 } from "lucide-react";

const ConfigField = ({ label, children }) => (
    <div style={{ marginBottom: 18 }}>
        <label
            style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                color: "#6b6b8a",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {label}
        </label>
        {children}
    </div>
);

const fieldBase = {
    width: "100%",
    padding: "10px 13px",
    background: "#0a0a0f",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f0f0f5",
    borderRadius: 8,
    fontSize: 13,
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
};

function NodeConfigPanel({
    selectedNode,
    setSelectedNode,
    updateNodeConfig,
    deleteSelectedNode,
    sidebarAnimating,
    configWidth,
}) {
    if (!selectedNode) return null;

    const typeConfig = {
        httpRequest: { icon: <Globe size={15} color="#c8ff44" />, label: "HTTP Request" },
        webhookTrigger: { icon: <Webhook size={15} color="#c8ff44" />, label: "Webhook Trigger" },
        conditionNode: { icon: <GitBranch size={15} color="#c8ff44" />, label: "Condition" },
        delayNode: { icon: <Clock3 size={15} color="#c8ff44" />, label: "Delay" },
        emailNode: { icon: <Globe size={15} color="#c8ff44" />, label: "Email" },
    };

    const currentType = typeConfig[selectedNode.type] || { icon: <Globe size={15} color="#c8ff44" />, label: selectedNode.type };

    return (
        <>
            <style>{`
                @keyframes slideRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .config-panel-root {
                    animation: slideRight 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
                }
                .config-field:focus {
                    border-color: rgba(200,255,68,0.4) !important;
                    box-shadow: 0 0 0 3px rgba(200,255,68,0.08) !important;
                    background: rgba(255,255,255,0.03) !important;
                }
                .config-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a4a6a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                    padding-right: 32px !important;
                }
                .config-select option {
                    background: #0a0a0f;
                    color: #f0f0f5;
                }
                .delete-btn:hover {
                    background: rgba(255,71,117,0.12) !important;
                    color: #ff4775 !important;
                }
            `}</style>

            <div
                className="config-panel-root"
                style={{
                    position: "fixed",
                    right: 0,
                    top: 0,
                    height: "100vh",
                    width: configWidth || 380,
                    background: "rgba(12,12,20,0.98)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderLeft: "1px solid rgba(255,255,255,0.06)",
                    padding: "24px 22px",
                    overflowY: "auto",
                    zIndex: 50,
                    boxShadow: "-12px 0 40px rgba(0,0,0,0.5)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
            >
                {/* Panel Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 4,
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 4,
                            }}
                        >
                            <div
                                style={{
                                    width: 3,
                                    height: 18,
                                    background: "#c8ff44",
                                    borderRadius: 2,
                                }}
                            />
                            <h2
                                style={{
                                    color: "#f0f0f5",
                                    fontSize: 17,
                                    fontWeight: 800,
                                    margin: 0,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Node Config
                            </h2>
                        </div>
                        <div
                            style={{
                                fontSize: 10,
                                color: "#4a4a6a",
                                fontFamily: "'JetBrains Mono', monospace",
                                paddingLeft: 11,
                            }}
                        >
                            {selectedNode.id}
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedNode(null)}
                        style={{
                            background: "rgba(255,71,117,0.06)",
                            border: "1px solid rgba(255,71,117,0.12)",
                            color: "#ff4775",
                            cursor: "pointer",
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                            padding: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255,71,117,0.12)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255,71,117,0.06)";
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Type Badge */}
                <div
                    style={{
                        background: "rgba(200,255,68,0.06)",
                        border: "1px solid rgba(200,255,68,0.12)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    {currentType.icon}
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#c8ff44",
                        }}
                    >
                        {currentType.label}
                    </span>
                </div>

                {/* HTTP Config */}
                {selectedNode.type === "httpRequest" && (
                    <>
                        <ConfigField label="URL">
                            <input
                                value={selectedNode.data.config.url || ""}
                                onChange={(e) => updateNodeConfig("url", e.target.value)}
                                placeholder="https://api.example.com/endpoint"
                                className="config-field"
                                style={{ ...fieldBase }}
                            />
                        </ConfigField>

                        <ConfigField label="Method">
                            <select
                                value={selectedNode.data.config.method || "GET"}
                                onChange={(e) => updateNodeConfig("method", e.target.value)}
                                className="config-field config-select"
                                style={{ ...fieldBase }}
                            >
                                {["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"].map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </ConfigField>

                        <ConfigField label="Body JSON">
                            <textarea
                                value={selectedNode.data.config.body || ""}
                                onChange={(e) => updateNodeConfig("body", e.target.value)}
                                placeholder={'{\n  "key": "value"\n}'}
                                className="config-field"
                                style={{
                                    ...fieldBase,
                                    height: 140,
                                    resize: "vertical",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    lineHeight: 1.6,
                                    fontSize: 12,
                                }}
                            />
                        </ConfigField>

                        <ConfigField label="Timeout Seconds">
                            <input
                                type="number"
                                min="1"
                                value={selectedNode.data.config.timeout_seconds || 15}
                                onChange={(e) =>
                                    updateNodeConfig("timeout_seconds", Number(e.target.value))
                                }
                                className="config-field"
                                style={{ ...fieldBase }}
                            />
                        </ConfigField>

                        <ConfigField label="Enable Retry">
                            <select
                                value={selectedNode.data.config.retry?.enabled ? "true" : "false"}
                                onChange={(e) =>
                                    updateNodeConfig("retry", {
                                        ...(selectedNode.data.config.retry || {}),
                                        enabled: e.target.value === "true",
                                    })
                                }
                                className="config-field config-select"
                                style={{ ...fieldBase }}
                            >
                                <option value="false">Disabled</option>
                                <option value="true">Enabled</option>
                            </select>
                        </ConfigField>

                        <ConfigField label="Max Attempts">
                            <input
                                type="number"
                                min="1"
                                value={selectedNode.data.config.retry?.max_attempts || 1}
                                onChange={(e) =>
                                    updateNodeConfig("retry", {
                                        ...(selectedNode.data.config.retry || {}),
                                        max_attempts: Number(e.target.value),
                                    })
                                }
                                className="config-field"
                                style={{ ...fieldBase }}
                            />
                        </ConfigField>

                        <ConfigField label="Delay Seconds">
                            <input
                                type="number"
                                min="0"
                                value={selectedNode.data.config.retry?.delay_seconds || 0}
                                onChange={(e) =>
                                    updateNodeConfig("retry", {
                                        ...(selectedNode.data.config.retry || {}),
                                        delay_seconds: Number(e.target.value),
                                    })
                                }
                                className="config-field"
                                style={{ ...fieldBase }}
                            />
                        </ConfigField>
                    </>
                )}

                {/* Condition Config */}
                {selectedNode.type === "conditionNode" && (
                    <>
                        <ConfigField label="Field">
                            <input
                                value={selectedNode.data.config.field || ""}
                                onChange={(e) => updateNodeConfig("field", e.target.value)}
                                placeholder="response.status"
                                className="config-field"
                                style={{ ...fieldBase }}
                            />
                        </ConfigField>

                        <ConfigField label="Operator">
                            <select
                                value={selectedNode.data.config.operator || "equals"}
                                onChange={(e) => updateNodeConfig("operator", e.target.value)}
                                className="config-field config-select"
                                style={{ ...fieldBase }}
                            >
                                <option value="equals">Equals</option>
                                <option value="not_equals">Not Equals</option>
                                <option value="greater_than">Greater Than</option>
                                <option value="less_than">Less Than</option>
                                <option value="greater_than_or_equal">Greater Than or Equal</option>
                                <option value="less_than_or_equal">Less Than or Equal</option>
                                <option value="contains">Contains</option>
                                <option value="starts_with">Starts With</option>
                                <option value="ends_with">Ends With</option>
                                <option value="is_empty">Is Empty</option>
                                <option value="is_not_empty">Is Not Empty</option>
                            </select>
                        </ConfigField>

                        <ConfigField label="Value">
                            <input
                                value={selectedNode.data.config.value || ""}
                                onChange={(e) => updateNodeConfig("value", e.target.value)}
                                placeholder="active"
                                className="config-field"
                                style={{ ...fieldBase }}
                            />
                        </ConfigField>
                    </>
                )}

                {/* Delay Config */}
                {selectedNode.type === "delayNode" && (
                    <>
                        <ConfigField label="Duration">
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

                        <ConfigField label="Unit">
                            <select
                                value={selectedNode.data.config.unit || "second"}
                                onChange={(e) => updateNodeConfig("unit", e.target.value)}
                                className="config-field config-select"
                                style={{ ...fieldBase }}
                            >
                                <option value="second">Seconds</option>
                                <option value="minute">Minutes</option>
                                <option value="hour">Hours</option>
                                <option value="day">Days</option>
                            </select>
                        </ConfigField>
                    </>
                )}

                {/* Email Config */}
                {selectedNode.type === "emailNode" && (
                    <>
                        <ConfigField label="To">
                            <input
                                value={selectedNode.data.config.to || ""}
                                onChange={(e) => updateNodeConfig("to", e.target.value)}
                                placeholder="user@example.com"
                                className="config-field"
                                style={{ ...fieldBase }}
                            />
                        </ConfigField>

                        <ConfigField label="Subject">
                            <input
                                value={selectedNode.data.config.subject || ""}
                                onChange={(e) => updateNodeConfig("subject", e.target.value)}
                                placeholder="Hello {{trigger.name}}"
                                className="config-field"
                                style={{ ...fieldBase }}
                            />
                        </ConfigField>

                        <ConfigField label="Body">
                            <textarea
                                value={selectedNode.data.config.body || ""}
                                onChange={(e) => updateNodeConfig("body", e.target.value)}
                                placeholder="Write email body here..."
                                className="config-field"
                                style={{
                                    ...fieldBase,
                                    height: 150,
                                    resize: "vertical",
                                    lineHeight: 1.6,
                                }}
                            />
                        </ConfigField>
                    </>
                )}

                {/* Delete */}
                <button
                    onClick={deleteSelectedNode}
                    className="delete-btn"
                    style={{
                        width: "100%",
                        background: "rgba(255,71,117,0.06)",
                        color: "#ff4775",
                        border: "1px solid rgba(255,71,117,0.12)",
                        padding: "12px",
                        borderRadius: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        transition: "all 0.2s",
                        fontFamily: "'Inter', sans-serif",
                        marginTop: 8,
                    }}
                >
                    <Trash2 size={14} />
                    Delete Node
                </button>

                {/* Config Preview */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 10,
                        padding: "14px",
                        marginTop: 4,
                    }}
                >
                    <div
                        style={{
                            fontSize: 10,
                            color: "#4a4a6a",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: 10,
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        Live Config Preview
                    </div>
                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            fontSize: 11,
                            color: "#6b6b8a",
                            fontFamily: "'JetBrains Mono', monospace",
                            lineHeight: 1.7,
                            margin: 0,
                        }}
                    >
                        {JSON.stringify(selectedNode.data.config, null, 2)}
                    </pre>
                </div>
            </div>
        </>
    );
}

export default NodeConfigPanel;
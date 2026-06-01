// src/features/workflow/components/NodeConfigPanel.jsx
import { X, Globe, Webhook, GitBranch, Clock3, Trash2, Bot } from "lucide-react";

const ConfigField = ({ label, children }) => (
    <div style={{ marginBottom: 18 }}>
        <label
            style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                color: "#aaa",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
                fontFamily: "'Geist Mono', monospace",
            }}
        >
            {label}
        </label>
        {children}
    </div>
);

const fieldBase = {
    width: "100%",
    padding: "9px 12px",
    background: "#fafafa",
    border: "1px solid #e5e5e5",
    color: "#111",
    borderRadius: 6,
    fontSize: 13,
    outline: "none",
    transition: "border-color 0.15s ease, background 0.15s ease",
    fontFamily: "'Geist', 'Inter', sans-serif",
    boxSizing: "border-box",
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
        httpRequest: { icon: <Globe size={15} color="#111" />, label: "HTTP Request" },
        webhookTrigger: { icon: <Webhook size={15} color="#111" />, label: "Webhook Trigger" },
        conditionNode: { icon: <GitBranch size={15} color="#111" />, label: "Condition" },
        delayNode: { icon: <Clock3 size={15} color="#111" />, label: "Delay" },
        emailNode: { icon: <Globe size={15} color="#111" />, label: "Email" },
        aiNode: { icon: <Bot size={15} color="#111" />, label: "AI" },
    };

    const currentType = typeConfig[selectedNode.type] || { icon: <Globe size={15} color="#111" />, label: selectedNode.type };

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
                    border-color: #111 !important;
                    background: #fff !important;
                }
                .config-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                    padding-right: 32px !important;
                }
                .config-select option {
                    background: #fff;
                    color: #111;
                }
                .delete-btn {
                    width: 100%;
                    background: transparent;
                    color: #ef4444;
                    border: 1px solid #e5e5e5;
                    padding: 10px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.15s;
                    font-family: 'Geist', 'Inter', sans-serif;
                    margin-top: 8px;
                }
                .delete-btn:hover {
                    border-color: #ef4444 !important;
                    background: #fef2f2 !important;
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
                    background: "#fff",
                    borderLeft: "1px solid #e5e5e5",
                    padding: "24px 22px",
                    overflowY: "auto",
                    zIndex: 50,
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    fontFamily: "'Geist', 'Inter', sans-serif",
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
                            <h2
                                style={{
                                    color: "#111",
                                    fontSize: 18,
                                    fontWeight: 700,
                                    margin: 0,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Node Config
                            </h2>
                        </div>
                        <div
                            style={{
                                fontSize: 11,
                                color: "#888",
                                fontFamily: "'Geist Mono', monospace",
                            }}
                        >
                            {selectedNode.id}
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedNode(null)}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#888",
                            cursor: "pointer",
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s",
                            padding: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f5f5f5";
                            e.currentTarget.style.color = "#111";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#888";
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Type Badge */}
                <div
                    style={{
                        background: "#fafafa",
                        border: "1px solid #e5e5e5",
                        borderRadius: 8,
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
                            fontWeight: 600,
                            color: "#111",
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
                                    fontFamily: "'Geist Mono', monospace",
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

                {/* AI Config */}
                {selectedNode.type === "aiNode" && (
                    <>
                        <ConfigField label="Prompt">
                            <textarea
                                value={selectedNode.data.config.prompt || ""}
                                onChange={(e) =>
                                    updateNodeConfig("prompt", e.target.value)
                                }
                                placeholder="Summarize this message: {{trigger.message}}"
                                className="config-field"
                                style={{
                                    ...fieldBase,
                                    height: 180,
                                    resize: "vertical",
                                    lineHeight: 1.6,
                                    fontFamily: "'Geist Mono', monospace",
                                }}
                            />
                        </ConfigField>

                        <ConfigField label="Model">
                            <input
                                value={
                                    selectedNode.data.config.model ||
                                    "gemini-2.5-flash"
                                }
                                onChange={(e) =>
                                    updateNodeConfig("model", e.target.value)
                                }
                                placeholder="gemini-2.5-flash"
                                className="config-field"
                                style={{ ...fieldBase }}
                            />
                        </ConfigField>
                    </>
                )}

                {/* Delete */}
                <button
                    onClick={deleteSelectedNode}
                    className="delete-btn"
                >
                    <Trash2 size={14} />
                    Delete Node
                </button>

                {/* Config Preview */}
                <div
                    style={{
                        background: "#fafafa",
                        border: "1px solid #e5e5e5",
                        borderRadius: 8,
                        padding: "14px",
                        marginTop: 4,
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "#aaa",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: 10,
                            fontFamily: "'Geist Mono', monospace",
                        }}
                    >
                        Live Config Preview
                    </div>
                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            fontSize: 11,
                            color: "#555",
                            fontFamily: "'Geist Mono', monospace",
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
import {
    Webhook,
    Globe,
    Mail,
    Clock3,
    GitBranch,
    Bot,
    Layers3,
    ChevronRight,
    Zap,
} from "lucide-react";

import { T } from "../constants/workflowTheme";

const PaletteNode = ({
    icon: Icon,
    title,
    sub,
    onDragStart,
    disabled,
}) => {
    if (disabled) {
        return (
            <div
                style={{
                    background: T.bg,
                    border: `1px solid ${T.border}`,
                    borderRadius: T.radius,
                    padding: "14px 16px",
                    marginBottom: 10,
                    opacity: 0.45,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: T.surface,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon size={16} color={T.textDim} />
                </div>

                <div>
                    <div
                        style={{
                            color: T.textMid,
                            fontWeight: 600,
                            fontSize: 13,
                        }}
                    >
                        {title}
                    </div>

                    <div
                        style={{
                            color: T.textDim,
                            fontSize: 11,
                            marginTop: 2,
                        }}
                    >
                        Coming soon
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            draggable
            onDragStart={onDragStart}
            className="node-palette"
            style={{
                width: "100%",
                background: T.accentDim,
                border: `1px solid rgba(200,255,68,0.2)`,
                borderRadius: T.radius,
                padding: "14px 16px",
                marginBottom: 10,
                cursor: "grab",
                textAlign: "left",
                transition:
                    "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                display: "flex",
                alignItems: "center",
                gap: 12,
            }}
        >
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: "rgba(200,255,68,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Icon size={16} color={T.accent} />
            </div>

            <div style={{ flex: 1 }}>
                <div
                    style={{
                        color: T.text,
                        fontWeight: 700,
                        fontSize: 13,
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        color: T.textMid,
                        fontSize: 11,
                        marginTop: 2,
                    }}
                >
                    {sub}
                </div>
            </div>

            <ChevronRight size={14} color={T.textDim} />
        </button>
    );
};

const sectionTitleStyle = {
    fontSize: 10,
    color: T.textDim,
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: 600,
    marginBottom: 10,
};

function NodeLibrary({ onDragStart }) {
    return (
        <div
            style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: T.radiusXl,
                padding: 18,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    marginBottom: 20,
                }}
            >
                <Layers3 size={16} color={T.accent} />

                <span
                    style={{
                        color: T.accent,
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "1.2px",
                    }}
                >
                    Node Library
                </span>
            </div>

            <div style={sectionTitleStyle}>Triggers</div>

            <PaletteNode
                icon={Webhook}
                title="Webhook Trigger"
                sub="Start workflow externally"
                onDragStart={(e) =>
                    onDragStart(e, "webhookTrigger")
                }
            />

            <div
                style={{
                    ...sectionTitleStyle,
                    marginTop: 6,
                }}
            >
                Actions
            </div>

            <PaletteNode
                icon={Globe}
                title="HTTP Request"
                sub="Call APIs & endpoints"
                onDragStart={(e) =>
                    onDragStart(e, "httpRequest")
                }
            />

            <PaletteNode
                icon={Mail}
                title="Email"
                sub="Send email notification"
                onDragStart={(e) =>
                    onDragStart(e, "emailNode")
                }
            />

            <div
                style={{
                    ...sectionTitleStyle,
                    marginTop: 6,
                }}
            >
                Logic
            </div>

            <PaletteNode
                icon={GitBranch}
                title="Condition"
                sub="Branch workflow logic"
                onDragStart={(e) =>
                    onDragStart(e, "conditionNode")
                }
            />

            <div
                style={{
                    ...sectionTitleStyle,
                    marginTop: 6,
                }}
            >
                Coming Soon
            </div>

            <PaletteNode
                icon={Clock3}
                title="Delay"
                sub="Wait before continuing"
                onDragStart={(e) =>
                    onDragStart(e, "delayNode")
                }
            />

            <PaletteNode
                icon={Bot}
                title="AI Node"
                sub="LLM-powered step"
                disabled
            />

            <div
                style={{
                    marginTop: "auto",
                    paddingTop: 16,
                    borderTop: `1px solid ${T.border}`,
                    fontSize: 11,
                    color: T.textDim,
                    textAlign: "center",
                    lineHeight: 1.5,
                }}
            >
                <Zap
                    size={12}
                    style={{
                        display: "inline",
                        marginRight: 4,
                        verticalAlign: "middle",
                        color: T.accent,
                    }}
                />

                Drag nodes onto the canvas
            </div>
        </div>
    );
}

export default NodeLibrary;
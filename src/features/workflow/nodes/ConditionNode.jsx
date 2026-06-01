import { Handle, Position } from "reactflow";
import { GitBranch } from "lucide-react";

const ConditionNode = ({ data, selected }) => {
    const status = data.status || "idle";
    const isActive = status === "running";
    const isSuccess = status === "success";
    const isFailed = status === "failed";

    let borderClass = "border-white/10";
    let shadowClass = "";
    let animationClass = "";

    if (selected) {
        borderClass = "border-brand-primary/50";
        shadowClass = "shadow-[0_0_15px_rgba(139,92,246,0.2)]";
    }

    if (isActive) {
        borderClass = "border-brand-primary";
        animationClass = "animate-pulse-warning";
    } else if (isSuccess) {
        borderClass = "border-brand-success/50";
        animationClass = "animate-pulse-success";
    } else if (isFailed) {
        borderClass = "border-brand-danger";
        animationClass = "animate-shake-error";
    }

    const field = data.config?.field || "Select Field";
    const operator = data.config?.operator || "==";
    const value = data.config?.value || "Value";

    return (
        <>
            <div className={`w-[280px] rounded-xl bg-bg-panel/90 backdrop-blur-md border-2 ${borderClass} ${shadowClass} ${animationClass} transition-all duration-300 overflow-hidden`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                            <GitBranch size={14} />
                        </div>
                        <span className="text-[13px] font-bold text-text-primary tracking-tight">
                            Condition
                        </span>
                    </div>
                    {/* Status Dot */}
                    <div className={`w-2 h-2 rounded-full ${isActive ? "bg-brand-primary animate-pulse" :
                            isSuccess ? "bg-brand-success" :
                                isFailed ? "bg-brand-danger" :
                                    "bg-text-muted"
                        }`} />
                </div>

                {/* Body */}
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono mb-3 bg-black/20 p-2 rounded border border-white/5">
                        <span className="text-text-secondary truncate max-w-[80px]">{field}</span>
                        <span className="font-bold text-brand-primary">{operator}</span>
                        <span className="text-text-secondary truncate max-w-[80px]">{value}</span>
                    </div>

                    {status !== "idle" && (
                        <div className="flex items-center justify-between text-[11px] font-mono border-t border-white/5 pt-3 mb-2">
                            <span className="text-text-muted">Status:</span>
                            <span className={
                                isSuccess ? "text-brand-success" :
                                    isFailed ? "text-brand-danger" :
                                        "text-brand-primary"
                            }>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-text-muted mt-2 px-1">
                        <span>True</span>
                        <span>False</span>
                    </div>
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-bg-panel border-2 border-brand-primary rounded-full left-[-7px]"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="true"
                style={{ top: '25%' }}
                className="w-3 h-3 bg-bg-panel border-2 border-brand-success rounded-full right-[-7px]"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="false"
                style={{ top: '75%' }}
                className="w-3 h-3 bg-bg-panel border-2 border-brand-danger rounded-full right-[-7px]"
            />
        </>
    );
};

export default ConditionNode;
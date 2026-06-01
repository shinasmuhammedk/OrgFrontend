import { Handle, Position } from "reactflow";
import { Webhook } from "lucide-react";

const WebhookTriggerNode = ({ data, selected }) => {
    const status = data.status || "idle";
    const isActive = status === "running";
    const isSuccess = status === "success";
    const isFailed = status === "failed";

    let borderClass = "border-white/10";
    let shadowClass = "";
    let animationClass = "";

    if (selected) {
        borderClass = "border-brand-warning/50";
        shadowClass = "shadow-[0_0_15px_rgba(245,158,11,0.2)]";
    }

    if (isActive) {
        borderClass = "border-brand-warning";
        animationClass = "animate-pulse-warning";
    } else if (isSuccess) {
        borderClass = "border-brand-success/50";
        animationClass = "animate-pulse-success";
    } else if (isFailed) {
        borderClass = "border-brand-danger";
        animationClass = "animate-shake-error";
    }

    return (
        <>
            <div className={`w-[280px] rounded-xl bg-bg-panel/90 backdrop-blur-md border-2 ${borderClass} ${shadowClass} ${animationClass} transition-all duration-300 overflow-hidden`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-brand-warning/10 text-brand-warning flex items-center justify-center">
                            <Webhook size={14} />
                        </div>
                        <span className="text-[13px] font-bold text-text-primary tracking-tight">
                            Webhook Trigger
                        </span>
                    </div>
                    {/* Status Dot */}
                    <div className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-brand-warning animate-pulse" : 
                        isSuccess ? "bg-brand-success" : 
                        isFailed ? "bg-brand-danger" : 
                        "bg-text-muted"
                    }`} />
                </div>

                {/* Body */}
                <div className="px-4 py-4">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                        Endpoint URL
                    </div>
                    <div className="text-[11px] font-mono text-text-secondary truncate bg-black/20 p-2 rounded border border-white/5">
                        {data.config?.webhook_url || "Save to generate URL..."}
                    </div>
                    
                    {status !== "idle" && (
                        <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                            <span className="text-text-muted">Status:</span>
                            <span className={
                                isSuccess ? "text-brand-success" : 
                                isFailed ? "text-brand-danger" : 
                                "text-brand-warning"
                            }>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-bg-panel border-2 border-brand-warning rounded-full right-[-7px]"
            />
        </>
    );
};

export default WebhookTriggerNode;
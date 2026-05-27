import { Handle, Position } from "reactflow";
import { Mail } from "lucide-react";

const EmailNode = ({ data, selected }) => {
    const status = data.status || "idle";
    const isActive = status === "running";
    const isSuccess = status === "success";
    const isFailed = status === "failed";

    let borderClass = "border-white/10";
    let shadowClass = "";
    let animationClass = "";

    if (selected) {
        borderClass = "border-brand-tertiary/50";
        shadowClass = "shadow-[0_0_15px_rgba(167,139,250,0.2)]";
    }

    if (isActive) {
        borderClass = "border-brand-tertiary";
        animationClass = "animate-pulse-warning"; 
    } else if (isSuccess) {
        borderClass = "border-brand-success/50";
        animationClass = "animate-pulse-success";
    } else if (isFailed) {
        borderClass = "border-brand-danger";
        animationClass = "animate-shake-error";
    }

    const to = data.config?.to || "recipient@example.com";
    const subject = data.config?.subject || "No Subject";

    return (
        <div className={`w-[280px] rounded-xl bg-bg-panel/90 backdrop-blur-md border-2 ${borderClass} ${shadowClass} ${animationClass} transition-all duration-300 overflow-hidden`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-tertiary/10 text-brand-tertiary flex items-center justify-center">
                        <Mail size={14} />
                    </div>
                    <span className="text-[13px] font-bold text-text-primary tracking-tight">
                        Send Email
                    </span>
                </div>
                {/* Status Dot */}
                <div className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-brand-tertiary animate-pulse" : 
                    isSuccess ? "bg-brand-success" : 
                    isFailed ? "bg-brand-danger" : 
                    "bg-text-muted"
                }`} />
            </div>

            {/* Body */}
            <div className="px-4 py-4">
                <div className="flex flex-col gap-2 text-[11px] font-mono mb-3 bg-black/20 p-2 rounded border border-white/5">
                    <div className="flex gap-2">
                        <span className="text-text-muted shrink-0 w-8">To:</span>
                        <span className="text-text-secondary truncate">{to}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-text-muted shrink-0 w-8">Sub:</span>
                        <span className="text-text-secondary truncate">{subject}</span>
                    </div>
                </div>
                
                {status !== "idle" && (
                    <div className="flex items-center justify-between text-[11px] font-mono border-t border-white/5 pt-3">
                        <span className="text-text-muted">Status:</span>
                        <span className={
                            isSuccess ? "text-brand-success" : 
                            isFailed ? "text-brand-danger" : 
                            "text-brand-tertiary"
                        }>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </div>
                )}
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-bg-panel border-2 border-brand-tertiary rounded-full left-[-7px]"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-bg-panel border-2 border-brand-tertiary rounded-full right-[-7px]"
            />
        </div>
    );
};

export default EmailNode;
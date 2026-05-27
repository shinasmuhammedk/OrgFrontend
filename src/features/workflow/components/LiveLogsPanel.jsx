import { useState, useEffect, useRef } from "react";
import { Terminal, ChevronDown, ChevronUp, X } from "lucide-react";

export default function LiveLogsPanel({ liveLogs = [] }) {
    const [expanded, setExpanded] = useState(false);
    const [visible, setVisible] = useState(true);
    const prevLogsLength = useRef(0);
    const containerRef = useRef(null);

    // Auto-expand when new logs arrive
    useEffect(() => {
        if (liveLogs.length > 0 && liveLogs.length !== prevLogsLength.current) {
            setExpanded(true);
            setVisible(true);
        }
        prevLogsLength.current = liveLogs.length;
    }, [liveLogs.length]);

    // Auto‑scroll to the bottom when logs update
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [liveLogs]);

    if (!visible) return null;

    return (
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl bg-bg-panel border border-white/10 rounded-t-xl transition-all duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 ${expanded ? "h-64" : "h-10"}`}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 h-10 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors rounded-t-xl"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-secondary uppercase tracking-wider">
                    <Terminal size={14} className="text-brand-primary" />
                    Live Execution Logs
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded font-mono">
                        {liveLogs.length}
                    </span>
                    <button className="text-text-muted hover:text-text-primary transition-colors p-1">
                        {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>
                    <button
                        className="text-text-muted hover:text-brand-danger transition-colors p-1"
                        onClick={(e) => { e.stopPropagation(); setVisible(false); }}
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div
                ref={containerRef}
                className={`p-4 overflow-y-auto font-mono text-[11px] leading-relaxed transition-opacity duration-300 ${expanded ? "opacity-100 h-[calc(100%-40px)]" : "opacity-0 h-0 hidden"}`}
            >
                    {liveLogs.length === 0 ? (
                        <div className="text-text-muted opacity-50 select-none">
                            Waiting for workflow execution...
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {liveLogs.map((log, i) => (
                                <div key={log.id || i} className="flex items-start gap-3 hover:bg-white/5 px-2 py-1 rounded">
                                    <span className="text-text-muted shrink-0">[{log.time}]</span>
                                    <span className={
                                        log.status === "success" ? "text-brand-success" :
                                            log.status === "failed" ? "text-brand-danger" :
                                                "text-brand-warning"
                                    }>
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

            </div>
        </div>
    );
}

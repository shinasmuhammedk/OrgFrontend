import { useState, useEffect } from "react";
import {
    Webhook,
    Globe,
    Mail,
    Clock3,
    GitBranch,
    ChevronRight,
    Layers,
    ChevronLeft,
    Bot
} from "lucide-react";

const PaletteNode = ({ icon: Icon, title, type, onDragStart, disabled, colorClass }) => {
    if (disabled) {
        return (
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/5 opacity-50 mb-2 cursor-not-allowed">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-text-muted" />
                </div>
                <div>
                    <div className="text-xs font-bold text-text-muted">{title}</div>
                    <div className="text-[10px] text-text-muted/60 mt-0.5">Coming soon</div>
                </div>
            </div>
        );
    }

    return (
        <button
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-grab mb-2 group text-left"
        >
            <div className={`w-8 h-8 rounded-lg bg-${colorClass}/10 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_10px_currentColor] transition-shadow text-${colorClass}`}>
                <Icon size={14} />
            </div>
            <div className="flex-1">
                <div className="text-xs font-bold text-text-primary tracking-tight">{title}</div>
            </div>
            <ChevronRight size={14} className="text-text-muted group-hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
        </button>
    );
};

export default function NodeLibrary({ onDragStart }) {
    const [expanded, setExpanded] = useState(() => window.innerWidth >= 640);

    // Auto-collapse on mobile resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setExpanded(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`absolute top-20 sm:top-24 left-2 sm:left-4 z-40 transition-all duration-300 ease-in-out ${expanded ? "w-[200px] sm:w-[240px]" : "w-[48px] sm:w-[60px]"}`}>
            <div className="glass-panel overflow-hidden h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/5 shrink-0 bg-white/5">
                    {expanded && (
                        <div className="flex items-center gap-2 font-mono font-bold text-xs text-text-primary uppercase tracking-widest">
                            <Layers size={14} className="text-brand-primary" />
                            Nodes
                        </div>
                    )}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors ${!expanded ? "mx-auto" : ""}`}
                    >
                        <ChevronLeft size={16} className={`transition-transform duration-300 ${!expanded ? "rotate-180" : ""}`} />
                    </button>
                </div>

                {/* Body */}
                <div className={`p-3 overflow-y-auto flex-1 transition-opacity duration-300 ${expanded ? "opacity-100" : "opacity-0 invisible hidden"}`}>

                    <div className="text-[10px] font-bold text-brand-warning uppercase tracking-wider mb-2 ml-1">⚡ Triggers</div>
                    <PaletteNode icon={Webhook} title="Webhook" type="webhookTrigger" onDragStart={onDragStart} colorClass="brand-warning" />

                    <div className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider mb-2 mt-4 ml-1">🌐 Actions</div>
                    <PaletteNode icon={Globe} title="HTTP Request" type="httpRequest" onDragStart={onDragStart} colorClass="brand-secondary" />
                    <PaletteNode icon={Mail} title="Send Email" type="emailNode" onDragStart={onDragStart} colorClass="brand-tertiary" />
                    <PaletteNode
                        icon={Bot}
                        title="AI"
                        type="aiNode"
                        onDragStart={onDragStart}
                        colorClass="brand-primary"
                    />

                    <div className="text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-2 mt-4 ml-1">🧠 Logic</div>
                    <PaletteNode icon={GitBranch} title="Condition" type="conditionNode" onDragStart={onDragStart} colorClass="brand-primary" />

                    <PaletteNode icon={Clock3} title="Delay" type="delayNode" onDragStart={onDragStart} colorClass="brand-primary" />

                </div>

                {/* Collapsed view icons */}
                {!expanded && (
                    <div className="flex flex-col items-center gap-4 py-4 opacity-100 transition-opacity duration-300">
                        <Webhook size={18} className="text-brand-warning opacity-60 hover:opacity-100 cursor-pointer" onClick={() => setExpanded(true)} />
                        <Globe size={18} className="text-brand-secondary opacity-60 hover:opacity-100 cursor-pointer" onClick={() => setExpanded(true)} />
                        <Mail size={18} className="text-brand-tertiary opacity-60 hover:opacity-100 cursor-pointer" onClick={() => setExpanded(true)} />
                        <GitBranch size={18} className="text-brand-primary opacity-60 hover:opacity-100 cursor-pointer" onClick={() => setExpanded(true)} />
                        <Bot size={18} className="text-brand-primary opacity-60 hover:opacity-100 cursor-pointer" onClick={() => setExpanded(true)} />
                    </div>
                )}
            </div>
        </div>
    );
}
import { Save, Play, Loader2, ArrowLeft, Share2, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkflowHeader({ workflowName = "Untitled Workflow", handleSaveWorkflow, saving, handleRunWorkflow, running }) {
    const navigate = useNavigate();

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between glass-panel px-4 py-2 w-[calc(100%-2rem)] max-w-5xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors"
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={16} />
                </button>

                <div className="h-4 w-px bg-white/10" />

                <div className="flex flex-col">
                    <div className="text-[14px] font-bold text-text-primary leading-tight font-sans tracking-tight">
                        {workflowName}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse-success" />
                        Draft Saved • Last run 2m ago
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleSaveWorkflow}
                    disabled={saving}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save
                </button>

                <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
                >
                    <Share2 size={14} />
                    Share
                </button>

                <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 hover:bg-brand-secondary/20 transition-all"
                >
                    <Rocket size={14} />
                    Deploy
                </button>

                <div className="h-4 w-px bg-white/10 mx-1" />

                <button
                    onClick={handleRunWorkflow}
                    disabled={running}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
                >
                    {running ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Running…
                        </>
                    ) : (
                        <>
                            <Play size={14} fill="currentColor" />
                            Run
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

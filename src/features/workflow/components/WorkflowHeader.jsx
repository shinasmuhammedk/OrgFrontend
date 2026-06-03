import { Save, Play, Loader2, ArrowLeft, Share2, Rocket, History } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function WorkflowHeader({ workflowName = "Untitled Workflow", handleSaveWorkflow, saving, handleRunWorkflow, running }) {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between glass-panel px-2 sm:px-4 py-2 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-5xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors shrink-0"
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={16} />
                </button>

                <div className="h-4 w-px bg-white/10 hidden sm:block" />

                <div className="flex flex-col min-w-0">
                    <div className="text-[13px] sm:text-[14px] font-bold text-text-primary leading-tight font-sans tracking-tight truncate max-w-[100px] sm:max-w-[200px]">
                        {workflowName}
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-text-muted mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse-success" />
                        Draft Saved • Last run 2m ago
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                    onClick={handleSaveWorkflow}
                    disabled={saving}
                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all disabled:opacity-50"
                    title="Save"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span className="hidden sm:inline">Save</span>
                </button>

                <button
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
                >
                    <Share2 size={14} />
                    Share
                </button>

                <button
                    onClick={() => navigate(`/workflows/${id}/runs`)}
                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
                    title="History"
                >
                    <History size={14} />
                    <span className="hidden md:inline">History</span>
                </button>

                <button
                    className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 hover:bg-brand-secondary/20 transition-all"
                >
                    <Rocket size={14} />
                    Deploy
                </button>

                <div className="h-4 w-px bg-white/10 mx-0.5 sm:mx-1" />

                <button
                    onClick={handleRunWorkflow}
                    disabled={running}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
                >
                    {running ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            <span className="hidden sm:inline">Running…</span>
                        </>
                    ) : (
                        <>
                            <Play size={14} fill="currentColor" />
                            <span className="hidden sm:inline">Run</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

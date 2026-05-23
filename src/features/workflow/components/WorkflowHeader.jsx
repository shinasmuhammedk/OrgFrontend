import { Save, Play, Loader2 } from "lucide-react";

export default function WorkflowHeader({ handleSaveWorkflow, saving, handleRunWorkflow, running }) {
    return (
        <div className="flex justify-between items-start mb-7 flex-wrap gap-4">
            <div>
                <h1 className="text-white text-3xl font-extrabold m-0">
                    Workflow Canvas
                </h1>
                <p className="text-[#b4b4c7] text-sm leading-relaxed mt-1 mb-0">
                    Build, connect, save and run your automation workflow
                </p>
            </div>

            <div className="flex gap-2.5 flex-wrap">
                <button
                    onClick={handleSaveWorkflow}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#1a1a24] text-white border border-[#2a2a35] px-4 py-2.5 rounded-md font-bold text-sm cursor-pointer hover:bg-[#252535] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <Loader2 size={15} className="animate-spin" />
                            Saving…
                        </>
                    ) : (
                        <>
                            <Save size={15} />
                            Save Workflow
                        </>
                    )}
                </button>

                <button
                    onClick={handleRunWorkflow}
                    disabled={running}
                    className="flex items-center gap-2 bg-[#00e599] text-[#07070d] border-none px-5 py-2.5 rounded-md font-extrabold text-sm cursor-pointer hover:bg-[#00c985] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {running ? (
                        <>
                            <Loader2 size={15} className="animate-spin" />
                            Running…
                        </>
                    ) : (
                        <>
                            <Play size={15} fill="currentColor" />
                            Run Workflow
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

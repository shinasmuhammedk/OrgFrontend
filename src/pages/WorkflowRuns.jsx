import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, ChevronRight, ArrowLeft } from "lucide-react";

import api from "../services/api";

function WorkflowRuns() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRuns = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/workflows/${id}/runs`);
            setRuns(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch runs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchRuns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString();
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] p-7">
            <button
                onClick={() => navigate(`/workflows/${id}/canvas`)}
                className="mb-6 bg-transparent text-[#b4b4c7] border-none cursor-pointer flex items-center gap-2 text-sm font-medium hover:text-white transition-colors"
            >
                <ArrowLeft size={16} />
                Back to Canvas
            </button>

            <h1 className="text-3xl font-extrabold mb-2 text-white">Workflow Runs</h1>
            <p className="text-[#8a8a99] mb-7">View all executions of this workflow</p>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#12121a] border border-[#2a2a35] rounded-2xl p-4 flex justify-between items-center animate-pulse"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 bg-[#2a2a35] rounded-lg"></div>
                                <div>
                                    <div className="w-24 h-4 bg-[#2a2a35] rounded mb-2"></div>
                                    <div className="w-32 h-3 bg-[#1a1a24] rounded"></div>
                                </div>
                            </div>
                            <div className="w-16 h-6 bg-[#2a2a35] rounded-full"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <p className="text-[#ef4444] font-medium">{error}</p>
            ) : runs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-[#12121a] border border-[#2a2a35] rounded-2xl border-dashed">
                    <FileText size={48} className="text-[#2a2a35] mb-4" />
                    <p className="text-[#b4b4c7] font-medium text-lg m-0">No runs found.</p>
                    <p className="text-[#8a8a99] text-sm mt-1">Execute your workflow to see history here.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {runs.map((run) => (
                        <div
                            key={run.id}
                            onClick={() => navigate(`/workflow-runs/${run.id}`)}
                            className="bg-[#12121a] border border-[#2a2a35] rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-[#1a1a24] hover:border-[#3b3b4a] transition-all"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 flex items-center justify-center bg-[#1a1a24] rounded-lg border border-[#2a2a35]">
                                    <FileText size={18} className="text-[#b4b4c7]" />
                                </div>
                                <div>
                                    <div className="font-bold mb-1 text-white">
                                        Run #{run.id.slice(0, 8)}
                                    </div>
                                    <div className="text-xs text-[#8a8a99]">
                                        {formatDate(run.created_at)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${
                                        run.status === "success"
                                            ? "bg-[#22c55e26] text-[#22c55e]"
                                            : "bg-[#ef444426] text-[#ef4444]"
                                    }`}
                                >
                                    {run.status}
                                </span>
                                <ChevronRight size={18} className="text-[#8a8a99]" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WorkflowRuns;
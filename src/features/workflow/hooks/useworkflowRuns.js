import { useState } from "react";
import api from "../../../services/api";

export function useWorkflowRuns(workflowId, setError) {
    const [runs, setRuns] = useState([]);
    const [loadingRuns, setLoadingRuns] = useState(false);

    const fetchRuns = async () => {
        try {
            setLoadingRuns(true);

            const res = await api.getWorkflowRuns(workflowId);
            setRuns(res.data || []);

            return res.data || [];
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoadingRuns(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === "N/A") return "N/A";

        try {
            return new Date(dateStr).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateStr;
        }
    };

    return {
        runs,
        loadingRuns,
        fetchRuns,
        formatDate,
    };
}
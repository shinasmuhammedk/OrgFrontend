import { FileText, ChevronRight } from "lucide-react";
import { T } from "../constants/workflowTheme";
import SkeletonCard from "./SkeletonCard";

const StatusBadge = ({ status }) => {
    const isSuccess = status === "success";
    const color = isSuccess ? T.accent : T.error;

    return (
        <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 99,
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            background: `${color}12`,
            color,
            border: `1px solid ${color}33`,
            fontFamily: T.fontMono,
        }}>
            {status}
        </span>
    );
};

function RunHistoryList({ runs, loading, navigate, formatDate }) {
    return (
        <>
            {/* paste your run history JSX here */}
        </>
    );
}

export default RunHistoryList;
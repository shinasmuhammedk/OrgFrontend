import { useEffect, useState } from "react";
const API_BASE_URL = "http://localhost:8080";

function WorkflowSchedulePanel({ workflowId }) {
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [scheduleValue, setScheduleValue] = useState("*/5 * * * *");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [nextRunAt, setNextRunAt] = useState("");

    const presets = [
        { label: "Every 5 min", value: "*/5 * * * *" },
        { label: "Every Hour", value: "0 * * * *" },
        { label: "Every Day", value: "0 9 * * *" },
        { label: "Every Monday", value: "0 9 * * 1" },
    ];

    const fetchSchedule = async () => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/workflows/${workflowId}/schedule`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const json = await res.json();
            const data = json.data;

            setScheduleEnabled(data.ScheduleEnabled);

            if (data.ScheduleValue?.Valid) {
                setScheduleValue(data.ScheduleValue.String);
            }

            if (data.NextRunAt?.Valid) {
                setNextRunAt(data.NextRunAt.Time);
            }
        } catch (err) {
            console.error("failed to fetch schedule", err);
        }
    };

    useEffect(() => {
        if (workflowId) {
            fetchSchedule();
        }
    }, [workflowId]);

    const saveSchedule = async () => {
        try {
            setLoading(true);
            setMessage("");

            await fetch(
                `${API_BASE_URL}/workflows/${workflowId}/schedule`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        enabled: scheduleEnabled,
                        schedule_type: "cron",
                        schedule_value: scheduleValue,
                    }),
                }
            );

            setMessage("Schedule updated successfully");

            await fetchSchedule();
        } catch (err) {
            console.error(err);

            setMessage("Failed to update workflow schedule");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                background: "#111827",
                border: "1px solid #1f2937",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                color: "#fff",
            }}
        >
            <h3
                style={{
                    marginBottom: "16px",
                    fontSize: "16px",
                    fontWeight: "600",
                }}
            >
                Workflow Schedule
            </h3>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                }}
            >
                <label>Enable Schedule</label>

                <input
                    type="checkbox"
                    checked={scheduleEnabled}
                    onChange={(e) => setScheduleEnabled(e.target.checked)}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                }}
            >
                {presets.map((preset) => (
                    <button
                        key={preset.value}
                        onClick={() => setScheduleValue(preset.value)}
                        style={{
                            background:
                                scheduleValue === preset.value
                                    ? "#2563eb"
                                    : "#1f2937",
                            border: "1px solid #374151",
                            color: "#fff",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                        }}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "16px",
                }}
            >
                <label>Cron Expression</label>

                <input
                    value={scheduleValue}
                    onChange={(e) => setScheduleValue(e.target.value)}
                    placeholder="*/5 * * * *"
                    style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #374151",
                        background: "#0f172a",
                        color: "#fff",
                        outline: "none",
                    }}
                />
            </div>

            <button
                onClick={saveSchedule}
                disabled={loading}
                style={{
                    background: "#2563eb",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "600",
                }}
            >
                {loading ? "Saving..." : "Save Schedule"}
            </button>

            {nextRunAt && (
                <p
                    style={{
                        marginTop: "12px",
                        fontSize: "13px",
                        color: "#9ca3af",
                    }}
                >
                    Next Run: {new Date(nextRunAt.replace("Z", "")).toLocaleString()}
                </p>
            )}

            {message && (
                <p
                    style={{
                        marginTop: "12px",
                        fontSize: "14px",
                        color: "#9ca3af",
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
}

export default WorkflowSchedulePanel;
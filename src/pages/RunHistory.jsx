import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function RunHistory() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [steps, setSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatJSON = (value) => {
    if (!value) return "null";

    try {
      if (typeof value === "string") {
        return JSON.stringify(JSON.parse(value), null, 2);
      }

      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchStepLogs = async () => {
      try {
        const res = await api.getWorkflowStepRuns(id);
        setSteps(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStepLogs();
  }, [id, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090e",
        color: "#e4e4f0",
        padding: "32px",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          background: "transparent",
          color: "#9898b8",
          border: "none",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h1 style={{ color: "#c8ff44", marginBottom: "8px" }}>
        Run Details
      </h1>

      <p style={{ color: "#9898b8", marginBottom: "28px" }}>
        Step-by-step execution logs
      </p>

      {error && (
        <p style={{ color: "#ff5c7a", marginBottom: "16px" }}>
          {error}
        </p>
      )}

      {loading && (
        <p style={{ color: "#9898b8" }}>Loading step logs...</p>
      )}

      {!loading && steps.length === 0 && (
        <p style={{ color: "#9898b8" }}>No step logs found.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ display: "grid", gap: "14px" }}>
          {steps.map((step, index) => (
            <div
              key={step.ID || step.id}
              onClick={() => setSelectedStep(step)}
              style={{
                background: "#12121a",
                border:
                  (selectedStep?.ID || selectedStep?.id) ===
                  (step.ID || step.id)
                    ? "1px solid #c8ff44"
                    : "1px solid #272738",
                borderRadius: "12px",
                padding: "16px",
                cursor: "pointer",
              }}
            >
              <h3
                style={{
                  color:
                    step.Status === "success" ||
                    step.status === "success"
                      ? "#c8ff44"
                      : "#ff5c7a",
                }}
              >
                Step {index + 1}:{" "}
                {(step.Status || step.status || "unknown").toUpperCase()}
              </h3>

              <p style={{ color: "#9898b8", marginTop: "8px" }}>
                Step ID: {step.WorkflowStepID || step.workflow_step_id}
              </p>

              <p style={{ color: "#9898b8" }}>
                Started:{" "}
                {step.StartedAt?.Time ||
                  step.started_at ||
                  "N/A"}
              </p>

              <p style={{ color: "#9898b8" }}>
                Finished:{" "}
                {step.FinishedAt?.Time ||
                  step.finished_at ||
                  "N/A"}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            background: "#12121a",
            border: "1px solid #272738",
            borderRadius: "12px",
            padding: "18px",
            minHeight: "300px",
          }}
        >
          {!selectedStep ? (
            <p style={{ color: "#9898b8" }}>
              Select a step to view input/output.
            </p>
          ) : (
            <>
              <h2
                style={{
                  marginBottom: "16px",
                  color: "#c8ff44",
                }}
              >
                Step Details
              </h2>

              <h3 style={{ marginBottom: "8px" }}>Input</h3>

              <pre
                style={{
                  background: "#09090e",
                  padding: "12px",
                  borderRadius: "8px",
                  overflowX: "auto",
                  marginBottom: "16px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {formatJSON(
                  selectedStep.Input?.RawMessage ||
                    selectedStep.input
                )}
              </pre>

              <h3 style={{ marginBottom: "8px" }}>Output</h3>

              <pre
                style={{
                  background: "#09090e",
                  padding: "12px",
                  borderRadius: "8px",
                  overflowX: "auto",
                  marginBottom: "16px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {formatJSON(
                  selectedStep.Output?.RawMessage ||
                    selectedStep.output
                )}
              </pre>

              <h3 style={{ marginBottom: "8px" }}>Error</h3>

              <pre
                style={{
                  background: "#09090e",
                  padding: "12px",
                  borderRadius: "8px",
                  overflowX: "auto",
                  color: "#ff5c7a",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedStep.ErrorMessage?.Valid
                  ? selectedStep.ErrorMessage.String
                  : selectedStep.error_message || "null"}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RunHistory;
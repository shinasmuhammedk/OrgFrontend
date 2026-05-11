import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const res = await api.getWorkflows();
      setWorkflows(res.data || []);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = async () => {
    try {
      setCreating(true);
      setError("");

      const res = await api.createWorkflow(
        "Untitled Workflow",
        "New workflow"
      );

      const workflowId =
        res.data?.id ||
        res.data?.ID ||
        res.id ||
        res.ID;

      navigate(`/workflows/${workflowId}/canvas`);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchWorkflows();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090e",
        color: "#e4e4f0",
        padding: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ color: "#c8ff44", margin: 0 }}>Workflows</h1>

        <button
          onClick={handleCreateWorkflow}
          disabled={creating}
          style={{
            background: "#c8ff44",
            color: "#07070d",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: creating ? "not-allowed" : "pointer",
            opacity: creating ? 0.7 : 1,
          }}
        >
          {creating ? "Creating..." : "+ New Workflow"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#ff5c7a", marginBottom: "16px" }}>{error}</p>
      )}

      {loading && <p>Loading workflows...</p>}

      {!loading && workflows.length === 0 && (
        <p style={{ color: "#9898b8" }}>
          No workflows found. Click “+ New Workflow” to create one.
        </p>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {workflows.map((workflow) => {
          const workflowId = workflow.ID || workflow.id;

          return (
            <div
              key={workflowId}
              onClick={() => navigate(`/workflows/${workflowId}/canvas`)}
              style={{
                padding: "18px",
                border: "1px solid #272738",
                borderRadius: "12px",
                cursor: "pointer",
                background: "#12121a",
              }}
            >
              <h3>{workflow.Name || workflow.name}</h3>
              <p style={{ color: "#9898b8" }}>
                {workflow.Description?.String ||
                  workflow.description ||
                  "No description"}
              </p>
              <p>Status: {workflow.IsActive || workflow.is_active ? "Active" : "Inactive"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
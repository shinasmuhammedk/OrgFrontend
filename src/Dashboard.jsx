import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./service/api";

function Dashboard() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchWorkflows = async () => {
      try {
        const res = await api.getWorkflows();
        setWorkflows(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh", background: "#09090e", color: "#e4e4f0", padding: "32px" }}>
      <h1 style={{ color: "#c8ff44", marginBottom: "24px" }}>Workflows</h1>

      {loading && <p>Loading workflows...</p>}

      {!loading && workflows.length === 0 && (
        <p style={{ color: "#9898b8" }}>No workflows found.</p>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {workflows.map((workflow) => (
          <div
            key={workflow.ID}
            onClick={() => navigate(`/workflows/${workflow.ID}/canvas`)}
            style={{
              padding: "18px",
              border: "1px solid #272738",
              borderRadius: "12px",
              cursor: "pointer",
              background: "#12121a",
            }}
          >
            <h3>{workflow.Name}</h3>
            <p style={{ color: "#9898b8" }}>{workflow.Description?.String || "No description"}</p>
            <p>Status: {workflow.IsActive ? "Active" : "Inactive"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
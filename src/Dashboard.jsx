import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090e",
      color: "#e4e4f0",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 52px)",
        textAlign: "center",
        padding: "20px",
      }}>
        <div>
          <h1 style={{
            fontSize: "32px",
            fontFamily: "'Space Mono', monospace",
            color: "#c8ff44",
            marginBottom: "16px",
          }}>
            Dashboard
          </h1>
          <p style={{ color: "#9898b8" }}>
            Dashboard content will be added here
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
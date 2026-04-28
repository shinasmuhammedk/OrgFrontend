import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RunHistory() {
  const navigate = useNavigate();

  useEffect(() => {
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
      }}>
        <div>
          <h1 style={{ fontSize: "32px", fontFamily: "'Space Mono', monospace", color: "#c8ff44", marginBottom: "16px" }}>
            Run History
          </h1>
          <p style={{ color: "#9898b8" }}>Run history will be here</p>
        </div>
      </div>
    </div>
  );
}

export default RunHistory;
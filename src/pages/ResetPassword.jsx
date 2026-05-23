import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    try {
      setLoading(true);

      await api.post("/reset-password", {
        token,
        new_password: newPassword,
      });

      setMessage("Password reset successful.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#f0f0f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 400,
          background: "#12121a",
          padding: 30,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h1>Reset Password</h1>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 20,
            borderRadius: 10,
            border: "1px solid #2a2a35",
            background: "#181824",
            color: "#fff",
          }}
        />

        <button
          onClick={handleResetPassword}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "#c8ff44",
            color: "#0a0a0f",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <p style={{ marginTop: 16, color: "#8b8ba7" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
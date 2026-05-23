import { useState } from "react";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setLoading(true);

      await api.post("/forgot-password", {
        email,
      });

      setMessage("If this email exists, reset link has been sent.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
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
        <h1>Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onClick={handleForgotPassword}
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
          {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
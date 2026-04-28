// src/Hero.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    
    // Safely get user data from localStorage
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        const user = JSON.parse(userData);
        if (user && user.name) {
          setUserName(user.name.split(" ")[0]);
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      // If there's an error, just use default "User"
      setUserName("User");
    }
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090e",
      color: "#e4e4f0",
    }}>
      
      {/* Hero Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "60px 24px",
      }}>
        {/* Welcome Section */}
        <div style={{
          textAlign: "center",
          marginBottom: "60px",
        }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: 700,
            fontFamily: "'Space Mono', monospace",
            background: "linear-gradient(135deg, #c8ff44, #00e5c8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px",
          }}>
            Welcome back, {userName}!
          </h1>
          <p style={{
            fontSize: "18px",
            color: "#9898b8",
            maxWidth: "600px",
            margin: "0 auto",
          }}>
            Your workflow automation engine is ready. Create, deploy, and monitor your workflows in real-time.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "60px",
        }}>
          <div style={{
            background: "#0f0f17",
            border: "1px solid #252535",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#c8ff44",
              marginBottom: "8px",
            }}>5</div>
            <div style={{ color: "#9898b8", fontSize: "14px" }}>Active Workflows</div>
          </div>
          
          <div style={{
            background: "#0f0f17",
            border: "1px solid #252535",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#00e5c8",
              marginBottom: "8px",
            }}>847</div>
            <div style={{ color: "#9898b8", fontSize: "14px" }}>Runs This Month</div>
          </div>
          
          <div style={{
            background: "#0f0f17",
            border: "1px solid #252535",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#9d6fff",
              marginBottom: "8px",
            }}>99.1%</div>
            <div style={{ color: "#9898b8", fontSize: "14px" }}>Success Rate</div>
          </div>
          
          <div style={{
            background: "#0f0f17",
            border: "1px solid #252535",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#ffaa22",
              marginBottom: "8px",
            }}>1.3s</div>
            <div style={{ color: "#9898b8", fontSize: "14px" }}>Avg Duration</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: "#0f0f17",
          border: "1px solid #252535",
          borderRadius: "12px",
          padding: "32px",
          marginBottom: "40px",
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "20px",
            fontFamily: "'Space Mono', monospace",
          }}>Quick Actions</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}>
            <button style={{
              padding: "12px 20px",
              background: "rgba(200,255,68,0.1)",
              border: "1px solid rgba(200,255,68,0.2)",
              borderRadius: "8px",
              color: "#c8ff44",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.13s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(200,255,68,0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(200,255,68,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              + Create New Workflow
            </button>
            
            <button style={{
              padding: "12px 20px",
              background: "rgba(0,229,200,0.1)",
              border: "1px solid rgba(0,229,200,0.2)",
              borderRadius: "8px",
              color: "#00e5c8",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.13s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,229,200,0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,229,200,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              View Run History
            </button>
            
            <button style={{
              padding: "12px 20px",
              background: "rgba(157,111,255,0.1)",
              border: "1px solid rgba(157,111,255,0.2)",
              borderRadius: "8px",
              color: "#9d6fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.13s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(157,111,255,0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(157,111,255,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              Connect Integrations
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: "#0f0f17",
          border: "1px solid #252535",
          borderRadius: "12px",
          padding: "32px",
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "20px",
            fontFamily: "'Space Mono', monospace",
          }}>Recent Activity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: "✅", text: "Order Pipeline ran successfully", time: "2 minutes ago" },
              { icon: "⚡", text: "User Onboarding workflow started", time: "15 minutes ago" },
              { icon: "🔌", text: "Slack integration connected", time: "1 hour ago" },
              { icon: "📋", text: "Daily Analytics report sent", time: "3 hours ago" },
            ].map((activity, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderBottom: i < 3 ? "1px solid #252535" : "none",
              }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "rgba(200,255,68,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}>{activity.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#e4e4f0", marginBottom: "4px" }}>{activity.text}</div>
                  <div style={{ fontSize: "11px", color: "#55556a", fontFamily: "'Space Mono', monospace" }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
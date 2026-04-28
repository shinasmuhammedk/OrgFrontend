import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [ddOpen, setDdOpen] = useState(false);

  const navItems = ["Dashboard", "Canvas", "Run History", "Services", "GraphQL", "Integrations"];

  const handleNavigation = (item) => {
    setActiveNav(item);
    if (item === "Dashboard") {
      navigate("/dashboard");
    } else if (item === "Canvas") {
      navigate("/canvas");
    } else if (item === "Run History") {
      navigate("/run-history");
    } else if (item === "Services") {
      navigate("/services");
    } else if (item === "GraphQL") {
      navigate("/graphql");
    } else if (item === "Integrations") {
      navigate("/integrations");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        :root {
          --bg: #09090e;
          --bg2: #0f0f17;
          --bg3: #16161f;
          --bg4: #1c1c28;
          --line: #252535;
          --line2: #2e2e42;
          --text: #e4e4f0;
          --text2: #9898b8;
          --text3: #55556a;
          --lime: #c8ff44;
          --lime2: #a8e030;
          --cyan: #00e5c8;
          --rose: #ff3d6a;
          --amber: #ffaa22;
          --violet: #9d6fff;
          --blue: #3d9fff;
          --mono: 'DM Mono', 'Space Mono', monospace;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; font-family: inherit; border: none; outline: none; background: none; }
      `}</style>

      <div style={{
        background: "var(--bg2)",
        borderBottom: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: 0,
        height: "52px",
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--mono)",
            fontWeight: 500,
            fontSize: 16,
            letterSpacing: 2,
            color: "var(--lime)",
            marginRight: 28,
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              background: "var(--lime)",
              clipPath: "polygon(0 0,85% 0,100% 15%,100% 100%,0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="6.5" r="2" fill="#09090e" />
              <path
                d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2"
                stroke="#09090e"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          ORG
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--bg3)",
            border: "1px solid var(--line2)",
            borderRadius: 6,
            padding: "6px 12px",
            width: 220,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--text3)" strokeWidth="1.3">
            <circle cx="5" cy="5" r="4" />
            <path d="M8.5 8.5l2 2" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search workflows, runs…"
            style={{
              background: "none",
              border: "none",
              color: "var(--text)",
              fontSize: 12,
              width: "100%",
              outline: "none",
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: "var(--text3)",
              fontFamily: "var(--mono)",
              flexShrink: 0,
            }}
          >
            ⌘K
          </span>
        </div>

        {/* Navigation Items */}
        <div style={{ display: "flex", gap: 2, marginLeft: 22, flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavigation(item)}
              style={{
                padding: "7px 12px",
                borderRadius: 5,
                fontSize: 12.5,
                fontWeight: 400,
                color: activeNav === item ? "var(--lime)" : "var(--text2)",
                background: activeNav === item ? "rgba(200,255,68,.07)" : "none",
                transition: "all .13s",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
          {/* Notification Bell */}
          <button
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: "var(--bg3)",
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text2)",
              position: "relative",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M7 2a4.5 4.5 0 014.5 4.5V9l1 2H2l1-2V6.5A4.5 4.5 0 017 2z" />
              <path d="M5.5 11a1.5 1.5 0 003 0" strokeLinecap="round" />
            </svg>
            <span
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--rose)",
                border: "1.5px solid var(--bg2)",
              }}
            />
          </button>

          {/* Plan Tag */}
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              fontWeight: 500,
              padding: "4px 10px",
              borderRadius: 4,
              background: "rgba(200,255,68,.08)",
              color: "var(--lime)",
              border: "1px solid rgba(200,255,68,.2)",
              letterSpacing: ".04em",
            }}
          >
            FREE PLAN
          </span>

          {/* Avatar Dropdown */}
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setDdOpen(!ddOpen)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: "linear-gradient(135deg,var(--violet),var(--cyan))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "var(--mono)",
                cursor: "pointer",
              }}
            >
              AK
            </div>

            {/* Dropdown Menu */}
            {ddOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "var(--bg3)",
                  border: "1px solid var(--line2)",
                  borderRadius: 8,
                  padding: 6,
                  width: 200,
                  boxShadow: "0 8px 32px rgba(0,0,0,.5)",
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    padding: "8px 10px 10px",
                    borderBottom: "1px solid var(--line)",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Arun Kumar</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>arun@example.com</div>
                </div>
                {["Profile", "Billing", "API Keys", "Settings"].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "7px 10px",
                      borderRadius: 5,
                      color: "var(--text2)",
                      fontSize: 12.5,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg4)";
                      e.currentTarget.style.color = "var(--text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "none";
                      e.currentTarget.style.color = "var(--text2)";
                    }}
                  >
                    {item}
                  </div>
                ))}
                <div style={{ height: 1, background: "var(--line)", margin: "4px 0" }} />
                <div
                  onClick={handleSignOut}
                  style={{
                    padding: "7px 10px",
                    borderRadius: 5,
                    color: "var(--rose)",
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,61,106,.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  Sign out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
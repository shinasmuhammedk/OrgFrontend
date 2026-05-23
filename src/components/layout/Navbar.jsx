import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [ddOpen, setDdOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [notifOpen, setNotifOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");
    const [subscription, setSubscription] = useState(null);

    const navItems = [
        { label: "Dashboard", path: "/dashboard", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
        { label: "Services", path: "/services", icon: "M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z" },
        { label: "GraphQL", path: "/graphql", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" },
        { label: "Integrations", path: "/integrations", icon: "M22 17h-4v-7h4v7zm-2-5v3h-2v-3h2zm-4 5H8v-7h8v7zm-6-5v3h4v-3h-4zm-6 5H0v-7h4v7zm-2-5v3H0v-3h2zM4 8H0V1h4v7zm-2-5v3H0V3h2zm18 0v3h-2V3h2zM8 8H4V1h4v7zm-2-5v3H4V3h2zm6 5h-4V1h4v7zm-2-5v3h-2V3h2z" },
        { label: "Billing", path: "/billing", icon: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" },
    ];

    const notifications = [
        { id: 1, title: "Workflow completed", desc: "Data pipeline finished successfully", time: "2m ago", unread: true },
        { id: 2, title: "Service alert", desc: "GraphQL endpoint latency spike detected", time: "15m ago", unread: true },
        { id: 3, title: "Integration synced", desc: "Stripe webhook received and processed", time: "1h ago", unread: false },
    ];

    const getActiveNav = () => {
        const current = navItems.find(item => location.pathname === item.path);
        return current?.label || "Dashboard";
    };

    const activeNav = getActiveNav();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDdOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                document.getElementById("nav-search")?.focus();
            }
            if (e.key === "Escape") {
                setDdOpen(false);
                setNotifOpen(false);
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (!token) return;

        api.get("/me")
            .then((res) => {
                const data = res.data || res;
                setUser(data);
            });

        api.get("/billing/subscription")
            .then((res) => {
                const data = res.data || res;
                setSubscription(data);
            });
    }, [token]);

    const getInitials = (email) => {
        if (!email) return "U";
        return email.split("@")[0].slice(0, 2).toUpperCase();
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        :root {
          --bg: #0a0a0f;
          --bg-elevated: #12121a;
          --bg-surface: #181824;
          --bg-hover: #1e1e2e;
          --border-subtle: rgba(255,255,255,0.06);
          --border-default: rgba(255,255,255,0.1);
          --border-active: rgba(200,255,68,0.3);
          --text-primary: #f0f0f5;
          --text-secondary: #8b8ba7;
          --text-muted: #5a5a7a;
          --accent-lime: #c8ff44;
          --accent-lime-dim: rgba(200,255,68,0.12);
          --accent-rose: #ff4775;
          --accent-violet: #a78bfa;
          --accent-cyan: #22d3ee;
          --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
        }

        .navbar-glass {
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid var(--border-subtle);
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 8px;
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }

        .nav-item.active {
          color: var(--accent-lime);
          background: var(--accent-lime-dim);
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          background: var(--accent-lime);
          border-radius: 2px 2px 0 0;
          opacity: 0.6;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 8px 12px;
          width: 260px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-bar:focus-within {
          border-color: var(--border-active);
          background: var(--bg-hover);
          box-shadow: 0 0 0 3px rgba(200,255,68,0.08);
          width: 320px;
        }

        .search-bar input {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 13px;
          font-family: var(--font-sans);
          width: 100%;
          outline: none;
          letter-spacing: -0.01em;
        }

        .search-bar input::placeholder {
          color: var(--text-muted);
        }

        .kbd-shortcut {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--bg-elevated);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }

        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .icon-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--border-default);
          transform: translateY(-1px);
        }

        .icon-btn:active {
          transform: translateY(0);
        }

        .badge-pulse {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          background: var(--accent-rose);
          border-radius: 50%;
          border: 2px solid var(--bg);
        }

        .badge-pulse::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: var(--accent-rose);
          opacity: 0.4;
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }

        .dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          padding: 8px;
          min-width: 240px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02);
          z-index: 1000;
          animation: dropdown-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: top right;
        }

        @keyframes dropdown-in {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: var(--font-sans);
        }

        .dropdown-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .dropdown-item.danger {
          color: var(--accent-rose);
        }

        .dropdown-item.danger:hover {
          background: rgba(255,71,117,0.08);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 6px 8px;
        }

        .plan-badge {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(200,255,68,0.08);
          color: var(--accent-lime);
          border: 1px solid rgba(200,255,68,0.15);
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          font-family: var(--font-mono);
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          user-select: none;
        }

        .avatar:hover {
          border-color: var(--accent-violet);
          box-shadow: 0 0 0 3px rgba(167,139,250,0.15);
        }

        .avatar.active {
          border-color: var(--accent-violet);
        }

        .notification-item {
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .notification-item:hover {
          background: var(--bg-hover);
        }

        .notification-item.unread {
          background: rgba(200,255,68,0.03);
        }

        .notification-item.unread:hover {
          background: rgba(200,255,68,0.06);
        }

        .mobile-menu-btn {
          display: none;
        }

        @media (max-width: 1024px) {
          .desktop-nav { display: none; }
          .mobile-menu-btn { display: flex; }
          .search-bar { width: 180px; }
          .search-bar:focus-within { width: 220px; }
        }

        @media (max-width: 640px) {
          .search-bar { display: none; }
          .plan-badge { display: none; }
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-drawer.open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-drawer-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 280px;
          height: 100%;
          background: var(--bg-elevated);
          border-right: 1px solid var(--border-subtle);
          padding: 20px;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-drawer.open .mobile-drawer-panel {
          transform: translateX(0);
        }
      `}</style>

            {/* Mobile Drawer */}
            <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                <div className="mobile-drawer-panel" onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                        <div style={{
                            width: 32, height: 32, background: "var(--accent-lime)",
                            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <svg width="16" height="16" viewBox="0 0 13 13" fill="none">
                                <circle cx="6.5" cy="6.5" r="2" fill="#0a0a0f" />
                                <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2" stroke="#0a0a0f" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 16, color: "var(--accent-lime)", letterSpacing: 2 }}>
                            ORG
                        </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavigation(item.path)}
                                className={`nav-item ${activeNav === item.label ? "active" : ""}`}
                                style={{ width: "100%", justifyContent: "flex-start" }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d={item.icon} />
                                </svg>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="navbar-glass" style={{
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
                gap: 0,
                height: "60px",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}>
                {/* Mobile Menu Button */}
                <button
                    className="icon-btn mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(true)}
                    style={{ marginRight: 12 }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                </button>

                {/* Logo */}
                <div
                    onClick={() => navigate("/dashboard")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        fontSize: 17,
                        letterSpacing: 2,
                        color: "var(--accent-lime)",
                        marginRight: 32,
                        flexShrink: 0,
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                >
                    <div style={{
                        width: 30,
                        height: 30,
                        background: "var(--accent-lime)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 20px rgba(200,255,68,0.2)",
                    }}>
                        <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                            <circle cx="6.5" cy="6.5" r="2" fill="#0a0a0f" />
                            <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2" stroke="#0a0a0f" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                    </div>
                    ORG
                </div>

                {/* Search Bar */}
                <div className="search-bar">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                        <circle cx="5" cy="5" r="4" />
                        <path d="M8.5 8.5l2 2" strokeLinecap="round" />
                    </svg>
                    <input
                        id="nav-search"
                        placeholder="Search workflows, runs..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    <span className="kbd-shortcut">⌘K</span>
                </div>

                {/* Desktop Navigation */}
                <div className="desktop-nav" style={{ display: "flex", gap: 4, marginLeft: 24, flex: 1 }}>
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleNavigation(item.path)}
                            className={`nav-item ${activeNav === item.label ? "active" : ""}`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
                                <path d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Right Section */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto", flexShrink: 0 }}>
                    {/* Notification Bell */}
                    <div ref={notifRef} style={{ position: "relative" }}>
                        <button
                            className="icon-btn"
                            onClick={() => setNotifOpen(!notifOpen)}
                            style={notifOpen ? { background: "var(--bg-hover)", color: "var(--text-primary)" } : {}}
                        >
                            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M7 2a4.5 4.5 0 014.5 4.5V9l1 2H2l1-2V6.5A4.5 4.5 0 017 2z" />
                                <path d="M5.5 11a1.5 1.5 0 003 0" strokeLinecap="round" />
                            </svg>
                            {unreadCount > 0 && <span className="badge-pulse" />}
                        </button>

                        {notifOpen && (
                            <div className="dropdown-panel" style={{ width: 320, right: -10 }}>
                                <div style={{ padding: "12px 12px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
                                        Notifications
                                    </span>
                                    <span style={{ fontSize: 11, color: "var(--accent-lime)", cursor: "pointer", fontWeight: 500 }}>
                                        Mark all read
                                    </span>
                                </div>
                                <div style={{ maxHeight: 320, overflowY: "auto", marginTop: 4 }}>
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className={`notification-item ${notif.unread ? "unread" : ""}`}>
                                            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                                <div style={{
                                                    width: 8, height: 8, borderRadius: "50%",
                                                    background: notif.unread ? "var(--accent-lime)" : "transparent",
                                                    border: notif.unread ? "none" : "2px solid var(--text-muted)",
                                                    marginTop: 6, flexShrink: 0
                                                }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
                                                        {notif.title}
                                                    </div>
                                                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2, lineHeight: 1.4 }}>
                                                        {notif.desc}
                                                    </div>
                                                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
                                                        {notif.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="dropdown-divider" />
                                <div className="dropdown-item" style={{ justifyContent: "center", color: "var(--text-muted)", fontSize: 12 }}>
                                    View all notifications
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Plan Badge */}
                    {token && (
                        <span className="plan-badge">
                            {(subscription?.plan || user?.plan || "free").toUpperCase()} PLAN
                        </span>
                    )}

                    {/* Avatar Dropdown */}
                    {!token ? (
                        <button
                            onClick={() => navigate("/login")}
                            className="nav-item"
                            style={{
                                background: "var(--accent-lime)",
                                color: "#0a0a0f",
                                fontWeight: 700,
                                borderRadius: "10px",
                                padding: "10px 16px",
                            }}
                        >
                            Login
                        </button>
                    ) : (
                        <div ref={dropdownRef} style={{ position: "relative" }}>
                            <div
                                className={`avatar ${ddOpen ? "active" : ""}`}
                                onClick={() => setDdOpen(!ddOpen)}
                            >
                                {getInitials(user?.email)}
                            </div>

                            {ddOpen && (
                                <div className="dropdown-panel">
                                    <div style={{ padding: "12px 12px 10px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 6 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div className="avatar" style={{ width: 40, height: 40, fontSize: 14, cursor: "default" }}>
                                                {getInitials(user?.email)}
                                            </div>

                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
                                                    {user?.email?.split("@")[0] || "User"}
                                                </div>
                                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-sans)" }}>
                                                    {user?.email || "No email"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {[
                                        { label: "Profile", path: "/profile", icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
                                        { label: "Billing", path: "/billing", icon: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" },
                                        { label: "API Keys", path: "/api-keys", icon: "M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" },
                                        { label: "Settings", path: "/settings", icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" },
                                    ].map((item) => (
                                        <div key={item.label} className="dropdown-item" onClick={() => handleNavigation(item.path)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d={item.icon} />
                                            </svg>
                                            {item.label}
                                        </div>
                                    ))}

                                    <div className="dropdown-divider" />

                                    <div className="dropdown-item danger" onClick={handleSignOut}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                                        </svg>
                                        Sign out
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;
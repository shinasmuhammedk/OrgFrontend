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
        api.get("/me").then((res) => setUser(res.data || res)).catch(() => {});
        api.get("/billing/subscription").then((res) => setSubscription(res.data || res)).catch(() => {});
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
            {/* Mobile Drawer */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setMobileMenuOpen(false)}>
                <div className={`absolute top-0 left-0 w-[280px] h-full bg-bg-elevated border-r border-white/5 p-5 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`} onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 13 13" fill="none">
                                <circle cx="6.5" cy="6.5" r="2" fill="#0a0a0f" />
                                <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2" stroke="#0a0a0f" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="font-mono font-bold text-brand-primary tracking-widest text-lg">ORG</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeNav === item.label ? "text-brand-primary bg-brand-primary/10" : "text-text-secondary hover:text-text-primary hover:bg-white/5"}`}
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
            <nav className="glass-nav sticky top-0 z-[100] flex items-center px-5 h-[60px]">
                {/* Mobile Menu Button */}
                <button
                    className="flex lg:hidden w-9 h-9 rounded-lg items-center justify-center bg-bg-elevated border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all mr-3"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                </button>

                {/* Logo */}
                <div
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2.5 font-mono font-bold text-[17px] tracking-widest text-brand-primary mr-8 shrink-0 cursor-pointer select-none"
                >
                    <div className="w-[30px] h-[30px] bg-brand-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(200,255,68,0.2)]">
                        <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                            <circle cx="6.5" cy="6.5" r="2" fill="#0a0a0f" />
                            <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2" stroke="#0a0a0f" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                    </div>
                    ORG
                </div>

                {/* Search Bar */}
                <div className="hidden sm:flex items-center gap-2.5 bg-bg-elevated border border-white/5 rounded-lg px-3 py-2 w-[260px] focus-within:w-[320px] focus-within:border-brand-primary/30 focus-within:bg-white/5 transition-all duration-200">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                        <circle cx="5" cy="5" r="4" />
                        <path d="M8.5 8.5l2 2" strokeLinecap="round" />
                    </svg>
                    <input
                        id="nav-search"
                        placeholder="Search workflows..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="bg-transparent border-none text-text-primary text-[13px] w-full outline-none placeholder-text-muted"
                    />
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-bg-panel text-text-muted border border-white/5 shrink-0">⌘K</span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1 ml-6 flex-1">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleNavigation(item.path)}
                            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${activeNav === item.label ? "text-brand-primary bg-brand-primary/10" : "text-text-secondary hover:text-text-primary hover:bg-white/5"}`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
                                <path d={item.icon} />
                            </svg>
                            {item.label}
                            {activeNav === item.label && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-brand-primary rounded-t-sm opacity-60" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3 ml-auto shrink-0">
                    {/* Notification Bell */}
                    <div ref={notifRef} className="relative">
                        <button
                            className={`relative flex items-center justify-center w-9 h-9 rounded-lg border border-white/5 transition-all ${notifOpen ? "bg-white/5 text-text-primary" : "bg-bg-elevated text-text-secondary hover:bg-white/5 hover:text-text-primary"}`}
                            onClick={() => setNotifOpen(!notifOpen)}
                        >
                            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M7 2a4.5 4.5 0 014.5 4.5V9l1 2H2l1-2V6.5A4.5 4.5 0 017 2z" />
                                <path d="M5.5 11a1.5 1.5 0 003 0" strokeLinecap="round" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-bg-panel animate-pulse" />
                            )}
                        </button>

                        {notifOpen && (
                            <div className="absolute top-[calc(100%+10px)] right-0 bg-bg-elevated border border-white/10 rounded-xl p-2 w-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[1000] animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center px-3 py-2">
                                    <span className="text-[13px] font-semibold text-text-primary">Notifications</span>
                                    <span className="text-[11px] text-brand-primary cursor-pointer font-medium hover:underline">Mark all read</span>
                                </div>
                                <div className="max-h-[320px] overflow-y-auto mt-1 space-y-1">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className={`p-2.5 rounded-lg cursor-pointer transition-colors ${notif.unread ? "bg-brand-primary/5 hover:bg-brand-primary/10" : "hover:bg-white/5"}`}>
                                            <div className="flex items-start gap-2.5">
                                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.unread ? "bg-brand-primary" : "border-2 border-text-muted bg-transparent"}`} />
                                                <div className="flex-1">
                                                    <div className="text-[12.5px] font-semibold text-text-primary leading-[1.4]">{notif.title}</div>
                                                    <div className="text-[12px] text-text-secondary mt-0.5 leading-[1.4]">{notif.desc}</div>
                                                    <div className="text-[11px] text-text-muted mt-1 font-mono">{notif.time}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="h-[1px] bg-white/5 my-1.5 mx-2" />
                                <div className="flex items-center justify-center p-2 text-text-muted text-[12px] hover:text-text-primary cursor-pointer rounded-lg hover:bg-white/5 transition-colors">
                                    View all notifications
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Plan Badge */}
                    {token && (
                        <span className="hidden sm:inline-block font-mono text-[10px] font-bold px-2.5 py-1 rounded-md bg-brand-primary/10 text-brand-primary border border-brand-primary/20 tracking-wide uppercase">
                            {(subscription?.plan || user?.plan || "free")} PLAN
                        </span>
                    )}

                    {/* Avatar Dropdown */}
                    {!token ? (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-brand-primary text-bg-panel font-bold rounded-lg px-4 py-2 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(200,255,68,0.3)] transition-all"
                        >
                            Login
                        </button>
                    ) : (
                        <div ref={dropdownRef} className="relative">
                            <div
                                className={`w-9 h-9 rounded-lg bg-gradient-to-br from-brand-tertiary to-brand-secondary flex items-center justify-center text-[12px] font-bold text-white font-mono cursor-pointer border-2 transition-all select-none ${ddOpen ? "border-brand-tertiary" : "border-transparent hover:border-brand-tertiary hover:shadow-[0_0_0_3px_rgba(167,139,250,0.15)]"}`}
                                onClick={() => setDdOpen(!ddOpen)}
                            >
                                {getInitials(user?.email)}
                            </div>

                            {ddOpen && (
                                <div className="absolute top-[calc(100%+10px)] right-0 bg-bg-elevated border border-white/10 rounded-xl p-2 min-w-[240px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[1000] animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-3 border-b border-white/5 mb-1.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-tertiary to-brand-secondary flex items-center justify-center text-[14px] font-bold text-white font-mono cursor-default">
                                                {getInitials(user?.email)}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-semibold text-text-primary">{user?.email?.split("@")[0] || "User"}</div>
                                                <div className="text-[12px] text-text-muted mt-0.5">{user?.email || "No email"}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {[
                                        { label: "Profile", path: "/profile", icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
                                        { label: "Billing", path: "/billing", icon: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" },
                                        { label: "API Keys", path: "/api-keys", icon: "M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" },
                                        { label: "Settings", path: "/settings", icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-white/5 hover:text-text-primary transition-colors" onClick={() => handleNavigation(item.path)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d={item.icon} />
                                            </svg>
                                            {item.label}
                                        </div>
                                    ))}

                                    <div className="h-[1px] bg-white/5 my-1.5 mx-2" />

                                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-pink-500 cursor-pointer hover:bg-pink-500/10 transition-colors" onClick={handleSignOut}>
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
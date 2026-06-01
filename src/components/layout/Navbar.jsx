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
    const [showNavbar, setShowNavbar] = useState(true);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 60) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
        api.get("/me").then((res) => setUser(res.data || res)).catch(() => { });
        api.get("/billing/subscription").then((res) => setSubscription(res.data || res)).catch(() => { });
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
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setMobileMenuOpen(false)}
            >
                <div
                    className={`absolute top-0 left-0 w-[260px] h-full bg-[#111118] border-r border-white/[0.07] p-5 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Drawer Logo */}
                    <div 
                        onClick={() => handleNavigation("/")}
                        className="flex items-center gap-2.5 mb-6 cursor-pointer select-none"
                    >
                        <div className="w-[30px] h-[30px] bg-[#c8ff44] rounded-[8px] flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                                <circle cx="6.5" cy="6.5" r="2" fill="#0a0a0f" />
                                <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2" stroke="#0a0a0f" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="font-mono font-bold text-[14px] tracking-[0.2em] text-[#c8ff44]">ORG</span>
                    </div>

                    {/* Drawer Links */}
                    <div className="flex flex-col gap-0.5">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-all duration-150 ${activeNav === item.label
                                    ? "text-[#c8ff44] bg-[#c8ff44]/10"
                                    : "text-[#6b6b80] hover:text-white hover:bg-white/[0.04]"
                                    }`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d={item.icon} />
                                </svg>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Navbar — Floating, centered, reduced width */}
            <div className={`fixed top-3 left-0 right-0 z-[100] w-full flex justify-center px-4 transition-all duration-300 ${showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>                    <nav className="flex items-center px-4 h-[52px] w-full max-w-[900px] rounded-[14px] bg-[#111118]/85 border border-white/[0.06] backdrop-blur-xl gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                style={{ backgroundImage: "linear-gradient(180deg,rgba(255,255,255,0.025) 0%,transparent 100%)" }}
            >
                {/* Mobile Menu Button */}
                <button
                    className="flex lg:hidden w-8 h-8 rounded-[8px] items-center justify-center bg-[#1a1a25] border border-white/[0.06] text-[#6b6b80] hover:text-white hover:border-white/[0.12] transition-all shrink-0"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                </button>

                {/* Logo */}
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
                >
                    <div className="w-[28px] h-[28px] bg-[#c8ff44] rounded-[7px] flex items-center justify-center shrink-0">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <circle cx="6.5" cy="6.5" r="2" fill="#0a0a0f" />
                            <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2" stroke="#0a0a0f" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="font-mono font-bold text-[13px] tracking-[0.2em] text-[#c8ff44]">ORG</span>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-4 bg-white/[0.08] shrink-0" />

                {/* Search Bar */}
                <div className={`hidden sm:flex items-center gap-2 h-[30px] px-2.5 rounded-[7px] bg-[#1a1a25] border transition-all duration-200 ${searchFocused
                    ? "border-[#c8ff44]/25 w-[200px] bg-white/[0.04]"
                    : "border-white/[0.06] w-[180px]"
                    }`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#6b6b80] shrink-0">
                        <circle cx="5" cy="5" r="4" />
                        <path d="M8.5 8.5l2 2" strokeLinecap="round" />
                    </svg>
                    <input
                        id="nav-search"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="bg-transparent border-none text-white text-[12px] w-full outline-none placeholder:text-[#6b6b80]"
                    />
                    <span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded-[3px] bg-[#09090f] text-[#6b6b80] border border-white/[0.08] shrink-0 leading-relaxed">⌘K</span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleNavigation(item.path)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-all duration-150 ${activeNav === item.label
                                ? "text-[#c8ff44] bg-[#c8ff44]/10"
                                : "text-[#6b6b80] hover:text-white hover:bg-white/[0.04]"
                                }`}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
                                <path d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 shrink-0">

                    {/* Notification Bell */}
                    <div ref={notifRef} className="relative">
                        <button
                            className={`relative flex items-center justify-center w-7 h-7 rounded-[7px] border transition-all ${notifOpen
                                ? "bg-white/[0.05] text-white border-white/[0.12]"
                                : "bg-[#1a1a25] border-white/[0.06] text-[#6b6b80] hover:text-white hover:border-white/[0.12]"
                                }`}
                            onClick={() => setNotifOpen(!notifOpen)}
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M7 2a4.5 4.5 0 014.5 4.5V9l1 2H2l1-2V6.5A4.5 4.5 0 017 2z" />
                                <path d="M5.5 11a1.5 1.5 0 003 0" strokeLinecap="round" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-[5px] right-[5px] w-[5px] h-[5px] bg-pink-400 rounded-full border-[1.5px] border-[#09090f]" />
                            )}
                        </button>

                        {notifOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-0 bg-[#111118] border border-white/[0.1] rounded-[14px] overflow-hidden w-[280px] shadow-[0_24px_48px_rgba(0,0,0,0.5)] z-[1000]">
                                <div className="flex justify-between items-center px-4 py-3 border-b border-white/[0.06]">
                                    <span className="text-[13px] font-medium text-white">Notifications</span>
                                    <span className="text-[11px] text-[#c8ff44] cursor-pointer hover:underline">Mark all read</span>
                                </div>
                                <div className="p-1.5 space-y-0.5">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`flex gap-2.5 items-start p-2.5 rounded-[8px] cursor-pointer transition-colors ${notif.unread ? "bg-[#c8ff44]/[0.04] hover:bg-[#c8ff44]/[0.07]" : "hover:bg-white/[0.04]"
                                                }`}
                                        >
                                            <div className={`w-[6px] h-[6px] rounded-full shrink-0 mt-[5px] ${notif.unread ? "bg-[#c8ff44]" : "border-[1.5px] border-[#6b6b80] bg-transparent"}`} />
                                            <div className="flex-1">
                                                <div className="text-[12px] font-medium text-white leading-snug">{notif.title}</div>
                                                <div className="text-[11px] text-[#6b6b80] mt-0.5 leading-snug">{notif.desc}</div>
                                                <div className="text-[10px] text-[#3a3a4e] font-mono mt-1">{notif.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-white/[0.06] p-2">
                                    <div className="text-center text-[12px] text-[#6b6b80] hover:text-white cursor-pointer py-1.5 rounded-[8px] hover:bg-white/[0.04] transition-colors">
                                        View all notifications
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Plan Badge */}
                    {token && (
                        <span className="hidden sm:inline-block font-mono text-[9px] font-bold px-2 py-0.5 rounded-[5px] bg-[#c8ff44]/10 text-[#c8ff44] border border-[#c8ff44]/20 tracking-[0.12em] uppercase">
                            {(subscription?.plan || user?.plan || "free")}
                        </span>
                    )}

                    {/* Avatar / Login */}
                    {!token ? (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-[#c8ff44] text-[#09090f] font-bold text-[12px] rounded-[7px] px-3.5 h-7 hover:-translate-y-px transition-all"
                        >
                            Login
                        </button>
                    ) : (
                        <div ref={dropdownRef} className="relative">
                            <div
                                className={`w-7 h-7 rounded-[7px] bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center text-[10px] font-bold text-white font-mono cursor-pointer border-[1.5px] transition-all select-none ${ddOpen ? "border-violet-400/60" : "border-transparent hover:border-violet-400/40"
                                    }`}
                                onClick={() => setDdOpen(!ddOpen)}
                            >
                                {getInitials(user?.email)}
                            </div>

                            {ddOpen && (
                                <div className="absolute top-[calc(100%+8px)] right-0 bg-[#111118] border border-white/[0.1] rounded-[14px] overflow-hidden min-w-[210px] shadow-[0_24px_48px_rgba(0,0,0,0.5)] z-[1000]">
                                    {/* User info header */}
                                    <div className="p-3 pb-3 border-b border-white/[0.06]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-[7px] bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center text-[12px] font-bold text-white font-mono shrink-0">
                                                {getInitials(user?.email)}
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-medium text-white">{user?.email?.split("@")[0] || "User"}</div>
                                                <div className="text-[11px] text-[#6b6b80] mt-0.5">{user?.email || "No email"}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="p-1.5">
                                        {[
                                            { label: "Profile", path: "/profile", icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
                                            { label: "Billing", path: "/billing", icon: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" },
                                            { label: "API Keys", path: "/api-keys", icon: "M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" },
                                            { label: "Settings", path: "/settings", icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[13px] text-[#6b6b80] cursor-pointer hover:bg-white/[0.04] hover:text-white transition-colors"
                                                onClick={() => handleNavigation(item.path)}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d={item.icon} />
                                                </svg>
                                                {item.label}
                                            </div>
                                        ))}

                                        <div className="h-px bg-white/[0.06] my-1 mx-1" />

                                        <div
                                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[13px] text-pink-400 cursor-pointer hover:bg-pink-500/[0.08] transition-colors"
                                            onClick={handleSignOut}
                                        >
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                                            </svg>
                                            Sign out
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
            </div>
        </>
    );
}

export default Navbar;
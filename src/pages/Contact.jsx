import { useState, useEffect } from "react";

export default function Contact() {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.message) {
            setSubmitted(true);
        }
    };

    return (
        <div style={S.root}>
            <style>{CSS}</style>
            <div style={S.gridBg} aria-hidden />

            <div style={{
                ...S.page,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(16px)",
                transition: "opacity 0.6s ease, transform 0.6s ease"
            }} className="m-page">

                <div style={S.header}>
                    <div style={S.sectionLabel}>Contact Us</div>
                    <h1 style={S.h1}>Get in touch</h1>
                    <p style={S.subtitle}>We'd love to hear from you. Reach out with any questions, feature requests, or support needs.</p>
                </div>

                <div style={S.contentLayout} className="m-content-layout">
                    {/* Left Column - Contact Methods */}
                    <div style={S.methodsCol}>
                        {[
                            { icon: "✉️", title: "Email Support", desc: "support@example.com", detail: "We aim to reply within 24 hours." },
                            { icon: "🏢", title: "Enterprise Sales", desc: "sales@example.com", detail: "Custom SLAs and deployment options." },
                            { icon: "💬", title: "Community Discord", desc: "Join our server", detail: "Chat with developers and users." },
                        ].map(m => (
                            <div key={m.title} style={S.methodCard} className="i-card">
                                <div style={S.methodIcon}>{m.icon}</div>
                                <div>
                                    <div style={S.methodTitle}>{m.title}</div>
                                    <div style={S.methodDesc}>{m.desc}</div>
                                    <div style={S.methodDetail}>{m.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column - Contact Form */}
                    <div style={S.formCol}>
                        <div style={S.formCard}>
                            {!submitted ? (
                                <form onSubmit={handleSubmit} style={S.form}>
                                    <div style={S.fieldRow} className="m-field-row">
                                        <div style={S.field}>
                                            <label style={S.label}>Name</label>
                                            <input 
                                                style={S.input} className="g-input" 
                                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                                                required placeholder="Jane Doe" 
                                            />
                                        </div>
                                        <div style={S.field}>
                                            <label style={S.label}>Email</label>
                                            <input 
                                                style={S.input} className="g-input" type="email" 
                                                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                                                required placeholder="jane@example.com" 
                                            />
                                        </div>
                                    </div>
                                    <div style={S.field}>
                                        <label style={S.label}>Subject</label>
                                        <select style={S.input} className="g-input" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                                            <option>General Inquiry</option>
                                            <option>Support Request</option>
                                            <option>Enterprise Sales</option>
                                            <option>Feature Request</option>
                                        </select>
                                    </div>
                                    <div style={S.field}>
                                        <label style={S.label}>Message</label>
                                        <textarea 
                                            style={{...S.input, minHeight: 120, resize: "vertical"}} className="g-input"
                                            value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} 
                                            required placeholder="How can we help you?"
                                        />
                                    </div>
                                    <button type="submit" style={S.submitBtn} className="g-btn-primary">
                                        Send Message
                                    </button>
                                </form>
                            ) : (
                                <div style={S.successState}>
                                    <div style={S.successIconWrap}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </div>
                                    <h3 style={S.successTitle}>Message Sent!</h3>
                                    <p style={S.successDesc}>Thanks for reaching out, {formData.name || "there"}. We'll get back to you shortly.</p>
                                    <button onClick={() => { setSubmitted(false); setFormData({...formData, message: ""}) }} style={S.resetBtn} className="g-btn-secondary">
                                        Send another message
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const S = {
    root: {
        minHeight: "100vh",
        background: "#fafafa",
        color: "#111",
        fontFamily: "'Geist', 'Inter', sans-serif",
        position: "relative",
        overflowX: "hidden",
    },
    gridBg: {
        position: "fixed",
        inset: 0,
        backgroundImage: "linear-gradient(#e8e8e8 1px, transparent 1px), linear-gradient(90deg, #e8e8e8 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.35,
        maskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)",
        zIndex: 0,
        pointerEvents: "none",
    },
    page: {
        position: "relative",
        zIndex: 1,
        maxWidth: 1080,
        margin: "0 auto",
        padding: "120px 40px 80px",
    },
    header: { marginBottom: 48, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
    sectionLabel: {
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#aaa",
        marginBottom: 14,
        fontFamily: "'Geist Mono', monospace",
    },
    h1: {
        fontSize: "clamp(2rem, 4vw, 2.8rem)",
        fontWeight: 700,
        letterSpacing: "-0.04em",
        color: "#111",
        margin: "0 0 12px",
        lineHeight: 1.1,
    },
    subtitle: { fontSize: 16, color: "#666", margin: 0, maxWidth: 540, lineHeight: 1.6 },

    contentLayout: {
        display: "flex",
        gap: 40,
        alignItems: "flex-start",
    },
    methodsCol: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    methodCard: {
        display: "flex",
        gap: 16,
        padding: "24px",
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        alignItems: "flex-start",
        transition: "box-shadow 0.15s, border-color 0.15s",
    },
    methodIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "#fafafa",
        border: "1px solid #e5e5e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        flexShrink: 0,
    },
    methodTitle: { fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 2 },
    methodDesc: { fontSize: 14, color: "#444", fontWeight: 500, marginBottom: 4 },
    methodDetail: { fontSize: 13, color: "#888", lineHeight: 1.5 },

    formCol: {
        flex: 1.3,
    },
    formCard: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        padding: "40px",
        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.05)",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    fieldRow: {
        display: "flex",
        gap: 20,
    },
    field: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: 600,
        color: "#111",
        letterSpacing: "-0.01em",
    },
    input: {
        width: "100%",
        padding: "12px 14px",
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        fontFamily: "'Geist', 'Inter', sans-serif",
        fontSize: 14,
        color: "#111",
        background: "#fafafa",
        outline: "none",
        transition: "border-color 0.15s, background 0.15s",
    },
    submitBtn: {
        marginTop: 12,
        width: "100%",
        padding: "14px",
        fontSize: 14,
        display: "flex",
        justifyContent: "center",
    },

    successState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 0",
    },
    successIconWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: 700,
        color: "#111",
        letterSpacing: "-0.02em",
        margin: "0 0 10px",
    },
    successDesc: {
        fontSize: 15,
        color: "#666",
        lineHeight: 1.6,
        marginBottom: 32,
        maxWidth: 320,
    },
    resetBtn: {
        padding: "10px 20px",
        background: "transparent",
        color: "#555",
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
    },
};

const CSS = `
  .g-btn-primary {
    background: #111;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Geist', 'Inter', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.15s;
  }
  .g-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .g-btn-secondary:hover { background: #fafafa !important; color: #111 !important; border-color: #bbb !important; }
  .g-input:focus { border-color: #111 !important; background: #fff !important; }
  .i-card:hover { border-color: #ccc; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  @media (max-width: 768px) {
    .m-page { padding: 90px 20px 60px !important; }
    .m-content-layout { flex-direction: column; gap: 32px !important; }
    .m-field-row { flex-direction: column; gap: 20px !important; }
  }
`;

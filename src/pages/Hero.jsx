// src/Hero.jsx — ORG Workflow Automation Platform Landing Page
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.dataset.section));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  const features = [
    {
      title: "Visual Canvas Builder",
      desc: "Drag, drop, and connect nodes to design complex automation pipelines without writing a single line of code.",
      icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z",
      color: "#c8ff44",
      bg: "rgba(200,255,68,0.08)",
      border: "rgba(200,255,68,0.12)",
    },
    {
      title: "GraphQL API First",
      desc: "Every workflow is automatically exposed as a typed GraphQL endpoint. Query, mutate, and subscribe in real-time.",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.12)",
    },
    {
      title: "200+ Integrations",
      desc: "Connect to Slack, Stripe, AWS, GitHub, Notion, and more. OAuth setup takes under 30 seconds.",
      icon: "M22 17h-4v-7h4v7zm-2-5v3h-2v-3h2zm-4 5H8v-7h8v7zm-6-5v3h4v-3h-4zm-6 5H0v-7h4v7zm-2-5v3H0v-3h2zM4 8H0V1h4v7zm-2-5v3H0V3h2zm18 0v3h-2V3h2zM8 8H4V1h4v7zm-2-5v3H4V3h2zm6 5h-4V1h4v7zm-2-5v3h-2V3h2z",
      color: "#22d3ee",
      bg: "rgba(34,211,238,0.08)",
      border: "rgba(34,211,238,0.12)",
    },
    {
      title: "Real-time Run History",
      desc: "Watch every step execute live. Debug with detailed logs, retry failed nodes, and inspect payloads.",
      icon: "M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",
      color: "#fb923c",
      bg: "rgba(251,146,60,0.08)",
      border: "rgba(251,146,60,0.12)",
    },
    {
      title: "Branching & Conditions",
      desc: "Add if/else logic, loops, and parallel branches. Handle errors gracefully with automatic fallbacks.",
      icon: "M17 20.41L18.41 19 15 15.59 13.59 17 17 20.41zM7.5 8H11v5.59L5.59 19 7 20.41l6-6V8h3.5L12 3.5 7.5 8z",
      color: "#ff4775",
      bg: "rgba(255,71,117,0.08)",
      border: "rgba(255,71,117,0.12)",
    },
    {
      title: "Self-hosted or Cloud",
      desc: "Deploy on our managed cloud or run entirely on your own infrastructure with our open-core engine.",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
      color: "#3d9fff",
      bg: "rgba(61,159,255,0.08)",
      border: "rgba(61,159,255,0.12)",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Design",
      desc: "Drag nodes onto the canvas and connect them with smart edges. Add triggers, actions, and conditions visually.",
    },
    {
      num: "02",
      title: "Connect",
      desc: "Authenticate with 200+ services in one click. ORG handles tokens, retries, and rate-limiting automatically.",
    },
    {
      num: "03",
      title: "Deploy",
      desc: "Hit deploy. Your workflow is live instantly with a GraphQL endpoint, webhook URL, and scheduled cron support.",
    },
    {
      num: "04",
      title: "Monitor",
      desc: "Track every execution in real-time. Inspect payloads, replay runs, and set up alerts for failures.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .landing-root {
          min-height: 100vh;
          background: #0a0a0f;
          color: #f0f0f5;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }

        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          overflow: hidden;
        }

        .hero-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,255,68,0.12) 0%, transparent 70%);
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          filter: blur(60px);
        }

        .hero-glow-2 {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%);
          bottom: 10%;
          right: 10%;
          pointer-events: none;
          filter: blur(80px);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 100px;
          background: rgba(200,255,68,0.06);
          border: 1px solid rgba(200,255,68,0.12);
          color: #c8ff44;
          font-size: 13px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.02em;
          margin-bottom: 32px;
        }

        .hero-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8ff44;
          box-shadow: 0 0 8px rgba(200,255,68,0.6);
          animation: pulse-dot 2s ease infinite;
        }

        .hero-title {
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          max-width: 900px;
          margin-bottom: 24px;
        }

        .hero-title .gradient {
          background: linear-gradient(135deg, #c8ff44 0%, #22d3ee 40%, #a78bfa 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(16px, 2vw, 20px);
          color: #6b6b8a;
          max-width: 560px;
          line-height: 1.7;
          margin-bottom: 40px;
          font-weight: 400;
        }

        .hero-cta-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 64px;
        }

        .btn-primary {
          padding: 14px 32px;
          border-radius: 12px;
          background: #c8ff44;
          color: #0a0a0f;
          font-size: 15px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.01em;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(200,255,68,0.25);
        }

        .btn-secondary {
          padding: 14px 32px;
          border-radius: 12px;
          background: transparent;
          color: #f0f0f5;
          font-size: 15px;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .hero-visual {
          position: relative;
          width: 100%;
          max-width: 900px;
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }

        .hero-visual-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .hero-visual-dot { width: 10px; height: 10px; border-radius: 50%; }

        .hero-visual-body {
          padding: 24px 28px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.8;
          text-align: left;
          color: #8b8ba7;
        }

        .hero-visual-body .code-keyword { color: #a78bfa; }
        .hero-visual-body .code-string { color: #c8ff44; }
        .hero-visual-body .code-func { color: #22d3ee; }
        .hero-visual-body .code-comment { color: #4a4a6a; }
        .hero-visual-body .code-plain { color: #e8e8f0; }

        .floating-node {
          position: absolute;
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: float 6s ease-in-out infinite;
          pointer-events: none;
        }

        .floating-node.n1 {
          top: 20%; left: 5%;
          background: rgba(200,255,68,0.08);
          border: 1px solid rgba(200,255,68,0.15);
          color: #c8ff44;
          animation-delay: 0s;
        }

        .floating-node.n2 {
          top: 35%; right: 5%;
          background: rgba(34,211,238,0.08);
          border: 1px solid rgba(34,211,238,0.15);
          color: #22d3ee;
          animation-delay: 1.5s;
        }

        .floating-node.n3 {
          bottom: 25%; left: 8%;
          background: rgba(167,139,250,0.08);
          border: 1px solid rgba(167,139,250,0.15);
          color: #a78bfa;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(200,255,68,0.6); }
          50% { opacity: 0.6; box-shadow: 0 0 16px rgba(200,255,68,0.3); }
        }

        .section {
          padding: 100px 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          color: #c8ff44;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
        }

        .section-heading {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 20px;
          max-width: 600px;
        }

        .section-desc {
          font-size: 17px;
          color: #6b6b8a;
          line-height: 1.7;
          max-width: 520px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 60px;
        }

        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          border-color: var(--feat-border);
          background: rgba(255,255,255,0.03);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--feat-color), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .feature-card:hover::before {
          opacity: 0.6;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--feat-bg);
          border: 1px solid var(--feat-border);
          margin-bottom: 20px;
        }

        .feature-icon svg {
          width: 24px;
          height: 24px;
          fill: var(--feat-color);
        }

        .feature-title {
          font-size: 17px;
          font-weight: 700;
          color: #f0f0f5;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .feature-desc {
          font-size: 14px;
          color: #5a5a7a;
          line-height: 1.65;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 60px;
        }

        .step-card {
          position: relative;
          padding: 32px 24px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .step-card:hover {
          border-color: rgba(255,255,255,0.1);
          transform: translateY(-4px);
        }

        .step-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 36px;
          font-weight: 800;
          color: transparent;
          -webkit-text-stroke: 1px rgba(200,255,68,0.3);
          margin-bottom: 16px;
          line-height: 1;
        }

        .step-title {
          font-size: 18px;
          font-weight: 700;
          color: #f0f0f5;
          margin-bottom: 10px;
        }

        .step-desc {
          font-size: 14px;
          color: #5a5a7a;
          line-height: 1.65;
        }

        .step-connector {
          position: absolute;
          top: 48px;
          right: -24px;
          width: 24px;
          height: 2px;
          background: linear-gradient(90deg, rgba(200,255,68,0.2), transparent);
        }

        .code-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-top: 40px;
        }

        .code-block {
          background: #0d0d14;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }

        .code-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
        }

        .code-dot { width: 10px; height: 10px; border-radius: 50%; }
        .code-title { font-size: 12px; color: #4a4a6a; font-family: 'JetBrains Mono', monospace; margin-left: 8px; }

        .code-body {
          padding: 24px 28px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.9;
          color: #8b8ba7;
          overflow-x: auto;
        }

        .code-body .k { color: #a78bfa; }
        .code-body .s { color: #c8ff44; }
        .code-body .f { color: #22d3ee; }
        .code-body .c { color: #4a4a6a; }
        .code-body .p { color: #e8e8f0; }
        .code-body .n { color: #fb923c; }

        .stats-bar {
          display: flex;
          justify-content: space-around;
          padding: 60px 24px;
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats-bar-item { text-align: center; }

        .stats-bar-num {
          font-size: 40px;
          font-weight: 800;
          color: #f0f0f5;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 8px;
          font-family: 'JetBrains Mono', monospace;
        }

        .stats-bar-label {
          font-size: 14px;
          color: #5a5a7a;
          font-weight: 500;
        }

        .cta-section {
          text-align: center;
          padding: 120px 24px;
          position: relative;
          overflow: hidden;
        }

        .cta-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,255,68,0.08) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          filter: blur(80px);
        }

        .cta-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .cta-title .gradient {
          background: linear-gradient(135deg, #c8ff44, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cta-desc {
          font-size: 18px;
          color: #6b6b8a;
          max-width: 460px;
          margin: 0 auto 40px;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .code-section { grid-template-columns: 1fr; }
          .step-connector { display: none; }
          .floating-node { display: none; }
        }

        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .stats-bar { flex-direction: column; gap: 32px; }
          .hero-cta-group { flex-direction: column; width: 100%; }
          .hero-cta-group button { width: 100%; }
          .section { padding: 60px 16px; }
        }
      `}</style>

      <div className="landing-root">
        {/* HERO */}
        <section className="hero-section" ref={heroRef}>
          <div className="hero-glow" />
          <div className="hero-glow-2" />

          <div className="floating-node n1">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8ff44' }} />
            trigger:webhook
          </div>
          <div className="floating-node n2">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee' }} />
            action:send_email
          </div>
          <div className="floating-node n3">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} />
            condition:if
          </div>

          <div className={`reveal ${isVisible('hero') ? 'visible' : ''}`} data-section="hero">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              v2.0 Now Available
            </div>

            <h1 className="hero-title">
              Build workflows that <span className="gradient">actually ship</span>
            </h1>

            <p className="hero-subtitle">
              ORG is the visual automation platform for modern teams. Design, connect, deploy, and monitor workflows with a canvas-first experience and a GraphQL API that just works.
            </p>

            <div className="hero-cta-group">
              <button className="btn-primary" onClick={() => navigate("/login")}>
                Start Building Free →
              </button>
              <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                View Demo Dashboard
              </button>
            </div>
          </div>

          <div className={`reveal reveal-delay-2 ${isVisible('hero') ? 'visible' : ''}`} data-section="hero">
            <div className="hero-visual">
              <div className="hero-visual-header">
                <span className="hero-visual-dot" style={{ background: '#ff5f57' }} />
                <span className="hero-visual-dot" style={{ background: '#febc2e' }} />
                <span className="hero-visual-dot" style={{ background: '#28c840' }} />
                <span style={{ marginLeft: 12, fontSize: 12, color: '#4a4a6a', fontFamily: "'JetBrains Mono', monospace" }}>
                  workflow.graphql
                </span>
              </div>
              <div className="hero-visual-body">
                <span className="code-keyword">query</span>{' '}
                <span className="code-func">GetWorkflowRuns</span>{' '}
                <span className="code-plain">{'{'}</span><br/>
                &nbsp;&nbsp;<span className="code-plain">workflow</span>{' '}
                <span className="code-plain">(</span><span className="code-plain">id</span>:{' '}
                <span className="code-string">"order-pipeline"</span><span className="code-plain">)</span>{' '}
                <span className="code-plain">{'{'}</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-plain">name</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-plain">status</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-plain">runs</span>{' '}
                <span className="code-plain">(</span><span className="code-plain">last</span>:{' '}
                <span className="code-func">5</span><span className="code-plain">)</span>{' '}
                <span className="code-plain">{'{'}</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-plain">edges</span>{' '}
                <span className="code-plain">{'{'}</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-plain">node</span>{' '}
                <span className="code-plain">{'{'}</span>{' '}
                <span className="code-comment">id status duration output</span>{' '}
                <span className="code-plain">{'}'}</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-plain">{'}'}</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-plain">{'}'}</span><br/>
                &nbsp;&nbsp;<span className="code-plain">{'}'}</span><br/>
                <span className="code-plain">{'}'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className={`reveal ${isVisible('stats') ? 'visible' : ''}`} data-section="stats">
          <div className="stats-bar">
            <div className="stats-bar-item">
              <div className="stats-bar-num">200+</div>
              <div className="stats-bar-label">Integrations</div>
            </div>
            <div className="stats-bar-item">
              <div className="stats-bar-num">50K+</div>
              <div className="stats-bar-label">Workflows Built</div>
            </div>
            <div className="stats-bar-item">
              <div className="stats-bar-num">99.9%</div>
              <div className="stats-bar-label">Uptime SLA</div>
            </div>
            <div className="stats-bar-item">
              <div className="stats-bar-num">&lt;1s</div>
              <div className="stats-bar-label">Avg Trigger Latency</div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <section className="section">
          <div className={`reveal ${isVisible('features') ? 'visible' : ''}`} data-section="features">
            <div className="section-label">Features</div>
            <h2 className="section-heading">
              Everything you need to automate at scale
            </h2>
            <p className="section-desc">
              From simple cron jobs to complex multi-step pipelines with conditional branching, ORG handles the heavy lifting so your team can focus on logic, not infrastructure.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feat, i) => (
              <div
                key={feat.title}
                className={`reveal reveal-delay-${i + 1} ${isVisible('features') ? 'visible' : ''}`}
                data-section="features"
              >
                <div
                  className="feature-card"
                  style={{
                    '--feat-color': feat.color,
                    '--feat-bg': feat.bg,
                    '--feat-border': feat.border,
                  }}
                >
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24"><path d={feat.icon} /></svg>
                  </div>
                  <div className="feature-title">{feat.title}</div>
                  <div className="feature-desc">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className={`reveal ${isVisible('steps') ? 'visible' : ''}`} data-section="steps">
            <div className="section-label">How It Works</div>
            <h2 className="section-heading">
              From idea to production in minutes, not days
            </h2>
            <p className="section-desc">
              No YAML. No Dockerfiles. No terraform. Just a canvas, a few clicks, and a deployed workflow.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`reveal reveal-delay-${i + 1} ${isVisible('steps') ? 'visible' : ''}`}
                data-section="steps"
              >
                <div className="step-card">
                  {i < steps.length - 1 && <div className="step-connector" />}
                  <div className="step-num">{step.num}</div>
                  <div className="step-title">{step.title}</div>
                  <div className="step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CODE PREVIEW */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className={`reveal ${isVisible('code') ? 'visible' : ''}`} data-section="code">
            <div className="code-section">
              <div>
                <div className="section-label">Developer Experience</div>
                <h2 className="section-heading">
                  GraphQL-native. Type-safe. Instant.
                </h2>
                <p className="section-desc">
                  Every workflow you build automatically generates a GraphQL schema. Query it, mutate it, or subscribe to real-time events. No REST. No guesswork. Full TypeScript support included.
                </p>
                <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {['TypeScript SDK', 'Webhooks', 'REST Fallback', 'CLI Tool'].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        background: 'rgba(200,255,68,0.06)',
                        border: '1px solid rgba(200,255,68,0.12)',
                        color: '#c8ff44',
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="code-block">
                <div className="code-header">
                  <span className="code-dot" style={{ background: '#ff5f57' }} />
                  <span className="code-dot" style={{ background: '#febc2e' }} />
                  <span className="code-dot" style={{ background: '#28c840' }} />
                  <span className="code-title">api.graphql</span>
                </div>
                <div className="code-body">
                  <span className="k">query</span>{' '}
                  <span className="f">GetWorkflowRuns</span>{' '}
                  <span className="p">{'{'}</span><br/>
                  &nbsp;&nbsp;<span className="p">workflow</span>{' '}
                  <span className="p">(</span><span className="p">id</span>:{' '}
                  <span className="s">"order-pipeline"</span><span className="p">)</span>{' '}
                  <span className="p">{'{'}</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="p">name</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="p">status</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="p">runs</span>{' '}
                  <span className="p">(</span><span className="p">last</span>:{' '}
                  <span className="n">5</span><span className="p">)</span>{' '}
                  <span className="p">{'{'}</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="p">edges</span>{' '}
                  <span className="p">{'{'}</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="p">node</span>{' '}
                  <span className="p">{'{'}</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="p">id</span>{' '}
                  <span className="p">status</span>{' '}
                  <span className="p">duration</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="p">output</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="p">{'}'}</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="p">{'}'}</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="p">{'}'}</span><br/>
                  &nbsp;&nbsp;<span className="p">{'}'}</span><br/>
                  <span className="p">{'}'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="cta-section">
          <div className="cta-glow" />
          <div className={`reveal ${isVisible('cta') ? 'visible' : ''}`} data-section="cta">
            <h2 className="cta-title">
              Ready to ship faster?<br />
              <span className="gradient">Start building for free.</span>
            </h2>
            <p className="cta-desc">
              No credit card required. Get 500 free runs per month on the Starter plan. Upgrade when you scale.
            </p>
            <div className="hero-cta-group" style={{ position: 'relative', zIndex: 1 }}>
              <button className="btn-primary" onClick={() => navigate("/login")}>
                Create Free Account →
              </button>
              <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                Explore the Dashboard
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Hero;
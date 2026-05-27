import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Activity, Grid, GitBranch, Cloud, Link2 } from "lucide-react";

function Hero() {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.dataset.section));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("[data-section]").forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  const handleStartBuilding = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const features = [
    {
      title: "Visual Canvas Builder",
      desc: "Drag, drop, and connect nodes to design complex automation pipelines without writing a single line of code.",
      icon: <Grid className="w-6 h-6 text-brand-primary" />,
    },
    {
      title: "GraphQL API First",
      desc: "Every workflow is automatically exposed as a typed GraphQL endpoint. Query, mutate, and subscribe in real-time.",
      icon: <Activity className="w-6 h-6 text-brand-tertiary" />,
    },
    {
      title: "200+ Integrations",
      desc: "Connect to Slack, Stripe, AWS, GitHub, Notion, and more. OAuth setup takes under 30 seconds.",
      icon: <Link2 className="w-6 h-6 text-brand-secondary" />,
    },
    {
      title: "Real-time Run History",
      desc: "Watch every step execute live. Debug with detailed logs, retry failed nodes, and inspect payloads.",
      icon: <Zap className="w-6 h-6 text-orange-400" />,
    },
    {
      title: "Branching & Conditions",
      desc: "Add if/else logic, loops, and parallel branches. Handle errors gracefully with automatic fallbacks.",
      icon: <GitBranch className="w-6 h-6 text-pink-500" />,
    },
    {
      title: "Self-hosted or Cloud",
      desc: "Deploy on our managed cloud or run entirely on your own infrastructure with our open-core engine.",
      icon: <Cloud className="w-6 h-6 text-blue-500" />,
    },
  ];

  const steps = [
    { num: "01", title: "Design", desc: "Drag nodes onto the canvas and connect them with smart edges. Add triggers, actions, and conditions visually." },
    { num: "02", title: "Connect", desc: "Authenticate with 200+ services in one click. ORG handles tokens, retries, and rate-limiting automatically." },
    { num: "03", title: "Deploy", desc: "Hit deploy. Your workflow is live instantly with a GraphQL endpoint, webhook URL, and scheduled cron support." },
    { num: "04", title: "Monitor", desc: "Track every execution in real-time. Inspect payloads, replay runs, and set up alerts for failures." },
  ];

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary overflow-x-hidden font-sans mesh-bg">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        
        {/* Floating Elements */}
        <div className="absolute top-[20%] left-[10%] animate-float glass-panel px-4 py-2 flex items-center gap-2 text-brand-primary font-mono text-xs hidden md:flex">
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse-glow" />
          trigger:webhook
        </div>
        <div className="absolute top-[35%] right-[10%] animate-float glass-panel px-4 py-2 flex items-center gap-2 text-brand-secondary font-mono text-xs hidden md:flex" style={{ animationDelay: '1.5s' }}>
          <div className="w-2 h-2 rounded-full bg-brand-secondary" />
          action:send_email
        </div>
        <div className="absolute bottom-[25%] left-[15%] animate-float glass-panel px-4 py-2 flex items-center gap-2 text-brand-tertiary font-mono text-xs hidden md:flex" style={{ animationDelay: '3s' }}>
          <div className="w-2 h-2 rounded-full bg-brand-tertiary" />
          condition:if
        </div>

        <div className={`transition-all duration-1000 transform ${isVisible('hero') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} data-section="hero">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-brand-primary/20 text-brand-primary text-xs font-bold font-mono tracking-wide mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse-glow" />
            v2.0 Now Available
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            Build workflows that <span className="text-gradient from-brand-primary via-brand-secondary to-brand-tertiary">actually ship</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            ORG is the visual automation platform for modern teams. Design, connect, deploy, and monitor workflows with a canvas-first experience and a GraphQL API that just works.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button 
              onClick={handleStartBuilding}
              className="px-8 py-4 rounded-xl bg-brand-primary text-bg-dark font-bold text-lg transition-transform hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(200,255,68,0.6)]"
            >
              Start Building Free &rarr;
            </button>
            <button 
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 rounded-xl glass-panel text-text-primary font-semibold text-lg transition-transform hover:-translate-y-1 hover:bg-white/5"
            >
              View Demo Dashboard
            </button>
          </div>
        </div>

        {/* Code Visualizer */}
        <div className={`w-full max-w-3xl glass-panel overflow-hidden transition-all duration-1000 delay-200 transform ${isVisible('hero') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} data-section="hero">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs text-text-secondary font-mono">workflow.graphql</span>
          </div>
          <div className="p-6 text-left font-mono text-sm leading-relaxed text-text-secondary overflow-x-auto">
            <span className="text-brand-tertiary">query</span> <span className="text-brand-secondary">GetWorkflowRuns</span> {'{'}<br/>
            &nbsp;&nbsp;workflow (id: <span className="text-brand-primary">"order-pipeline"</span>) {'{'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;name<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;status<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;runs (last: <span className="text-brand-secondary">5</span>) {'{'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;edges {'{'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node {'{'} <span className="text-gray-500">// id status duration output</span> {'}'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
            &nbsp;&nbsp;{'}'}<br/>
            {'}'}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={`py-12 border-y border-white/5 transition-all duration-1000 ${isVisible('stats') ? 'opacity-100' : 'opacity-0'}`} data-section="stats">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-text-primary mb-2 font-mono">200+</div>
            <div className="text-sm text-text-secondary font-medium">Integrations</div>
          </div>
          <div>
            <div className="text-4xl font-black text-text-primary mb-2 font-mono">50K+</div>
            <div className="text-sm text-text-secondary font-medium">Workflows Built</div>
          </div>
          <div>
            <div className="text-4xl font-black text-text-primary mb-2 font-mono">99.9%</div>
            <div className="text-sm text-text-secondary font-medium">Uptime SLA</div>
          </div>
          <div>
            <div className="text-4xl font-black text-text-primary mb-2 font-mono">&lt;1s</div>
            <div className="text-sm text-text-secondary font-medium">Avg Latency</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className={`mb-16 transition-all duration-1000 ${isVisible('features') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} data-section="features">
          <div className="text-brand-primary font-mono text-sm font-bold tracking-widest uppercase mb-4">Features</div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 max-w-2xl">
            Everything you need to automate at scale
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            From simple cron jobs to complex multi-step pipelines with conditional branching, ORG handles the heavy lifting so your team can focus on logic, not infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`glass-panel glass-panel-hover p-8 transition-all duration-1000`}
              style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              data-section="features"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">{feat.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className={`mb-16 transition-all duration-1000 ${isVisible('steps') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} data-section="steps">
          <div className="text-brand-secondary font-mono text-sm font-bold tracking-widest uppercase mb-4">How It Works</div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 max-w-2xl">
            From idea to production in minutes
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            No YAML. No Dockerfiles. No terraform. Just a canvas, a few clicks, and a deployed workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent z-0" />
          
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="glass-panel glass-panel-hover p-8 relative z-10"
            >
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-brand-primary/40 to-transparent font-mono mb-6 leading-none">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative text-center px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10">
          Ready to <span className="text-gradient from-brand-primary to-brand-secondary">automate?</span>
        </h2>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 relative z-10">
          Join thousands of developers building scalable workflows on ORG. Start building for free today.
        </p>
        <button 
          onClick={handleStartBuilding}
          className="relative z-10 px-10 py-5 rounded-2xl bg-brand-primary text-bg-dark font-bold text-xl transition-transform hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(200,255,68,0.6)]"
        >
          Create Your First Workflow
        </button>
      </section>
    </div>
  );
}

export default Hero;
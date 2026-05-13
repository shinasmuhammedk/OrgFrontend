export const T = {
    bg: "#07070b",
    panel: "#0f1117",
    panel2: "#12141c",
    border: "#232634",
    borderSoft: "#1b1e29",
    text: "#f3f5ff",
    textMid: "#b5bdd3",
    textDim: "#7d859c",
    accent: "#c8ff44",
    accentDim: "rgba(200,255,68,0.12)",
    success: "#22c55e",
    danger: "#ef4444",
    warning: "#f59e0b",
    running: "#3b82f6",
    radius: 18,
    shadow: "0 10px 30px rgba(0,0,0,0.35)",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontBody: "Inter, system-ui, sans-serif",
};

export const handleStyle = {
    width: 10,
    height: 10,
    border: "2px solid #0b0d12",
    background: T.accent,
};

export const nodeLabelStyle = {
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: T.textDim,
    marginBottom: 6,
    fontWeight: 700,
};

export const nodeHeaderBase = () => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderBottom: `1px solid ${T.borderSoft}`,
});

export const nodeShell = (selected, status) => ({
    width: 230,
    borderRadius: 20,
    overflow: "hidden",
    background: "linear-gradient(180deg,#10131b 0%, #0c0f16 100%)",
    border: `1px solid ${
        status === "success"
            ? "rgba(34,197,94,0.55)"
            : status === "error"
            ? "rgba(239,68,68,0.6)"
            : status === "running"
            ? "rgba(59,130,246,0.65)"
            : selected
            ? "rgba(200,255,68,0.55)"
            : T.border
    }`,
    boxShadow:
        status === "running"
            ? "0 0 0 1px rgba(59,130,246,0.5), 0 0 28px rgba(59,130,246,0.25)"
            : selected
            ? "0 0 0 1px rgba(200,255,68,0.35), 0 0 28px rgba(200,255,68,0.15)"
            : T.shadow,
    transition: "all .2s ease",
    position: "relative",
});
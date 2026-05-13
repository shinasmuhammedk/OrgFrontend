export const GLOBAL_WORKFLOW_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e1e30; border-radius: 99px; }

  .react-flow__attribution { display: none !important; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes toastIn { from { opacity: 0; transform: translateY(-12px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(200,255,68,0.35);
  }

  .btn-secondary:hover:not(:disabled) {
    border-color: rgba(200,255,68,0.5) !important;
    color: #c8ff44 !important;
  }

  .btn-ghost:hover { color: #c8ff44 !important; }

  .node-palette:hover {
    border-color: rgba(200,255,68,0.5) !important;
    background: rgba(200,255,68,0.1) !important;
    transform: translateY(-2px);
  }

  .config-field:focus {
    border-color: rgba(200,255,68,0.5) !important;
    box-shadow: 0 0 0 3px rgba(200,255,68,0.08) !important;
    outline: none !important;
  }

  .delete-btn:hover {
    background: rgba(255,92,122,0.18) !important;
  }
`;


import { T } from "../constants/workflowTheme";


const SkeletonCard = () => (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 18 }}>
        {[80, "55%", "35%"].map((w, i) => (
            <div key={i} style={{
                width: w, height: i === 0 ? 18 : 13,
                background: "linear-gradient(90deg, #eb0000 25%, #22223a 50%, #1a1a28 75%)",
                backgroundSize: "200% 100%",
                animation: `shimmer 1.5s ease-in-out infinite ${i * 0.15}s`,
                borderRadius: 6, marginBottom: i < 2 ? 10 : 0,
            }} />
        ))}
    </div>
);


export default SkeletonCard;
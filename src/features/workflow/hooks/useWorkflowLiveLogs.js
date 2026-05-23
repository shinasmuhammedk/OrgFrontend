import { useEffect, useState } from "react";

export function useWorkflowLiveLogs(workflowId, setNodes) {
    const [liveLogs, setLiveLogs] = useState([]);

    useEffect(() => {
        if (!workflowId) return;

        const eventSource = new EventSource(
            `http://localhost:8080/workflows/${workflowId}/events`
        );

        eventSource.addEventListener("workflow_update", (event) => {
            const data = JSON.parse(event.data);

            setLiveLogs((logs) => [
                ...logs,
                {
                    id: Date.now() + Math.random(),
                    time: new Date().toLocaleTimeString(),
                    status: data.status,
                    message: data.message || `${data.step_type || "Step"} ${data.status}`,
                },
            ]);

            console.log("sse update recieved", data);

            if (setNodes) {
                setNodes((currentNodes) =>
                    currentNodes.map((node) =>
                        node.data.backendStepId === data.step_id
                            ? {
                                ...node,
                                data: {
                                    ...node.data,
                                    status: data.status,
                                    error: data.error || null,
                                },
                            }
                            : node
                    )
                );
            }
        });

        eventSource.onerror = () => {
            console.log("SSE connection error");
        };

        return () => {
            eventSource.close();
        };
    }, [workflowId, setNodes]);

    return { liveLogs, setLiveLogs };
}

import { useCallback, useEffect, useState } from "react";
import { addEdge, useEdgesState, useNodesState } from "reactflow";
import api from "../../../services/api";
import { T } from "../constants/workflowTheme";

export function useWorkflowCanvas(workflowId, setError, showToast) {
    const [selectedNode, setSelectedNode] = useState(null);
    const [sidebarAnimating, setSidebarAnimating] = useState(false);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [saving, setSaving] = useState(false);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        (params) =>
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        animated: true,
                        style: { stroke: T.accent, strokeWidth: 2 },
                    },
                    eds
                )
            ),
        [setEdges]
    );

    const getConditionBranch = (edge) => {
        if (edge.ConditionBranch?.Valid) return edge.ConditionBranch.String;
        if (edge.condition_branch?.Valid) return edge.condition_branch.String;
        if (typeof edge.ConditionBranch === "string") return edge.ConditionBranch;
        if (typeof edge.condition_branch === "string") return edge.condition_branch;
        return "";
    };

    const fetchWorkflowSteps = async () => {
        try {
            const stepsRes = await api.getWorkflowSteps(workflowId);
            const edgesRes = await api.getWorkflowEdges(workflowId);

            const steps = stepsRes.data || [];
            const workflowEdges = edgesRes.data || [];

            const loadedNodes = steps.map((step, index) => {
                const stepType = step.StepType || step.step_type;

                return {
                    id: step.FrontendNodeID || step.frontend_node_id,
                    type:
                        stepType === "webhook_trigger"
                            ? "webhookTrigger"
                            : stepType === "condition"
                            ? "conditionNode"
                            : stepType === "delay"
                            ? "delayNode"
                            : stepType === "email"
                            ? "emailNode"
                            : "httpRequest",
                    position: {
                        x: 250 + (index % 3) * 300,
                        y: 150 + Math.floor(index / 3) * 220,
                    },
                    data: {
                        label:
                            stepType === "webhook_trigger"
                                ? "Webhook Trigger"
                                : stepType === "condition"
                                ? "Condition"
                                : stepType === "delay"
                                ? "Delay"
                                : stepType === "email"
                                ? "Email"
                                : "HTTP Request",
                        dbStepId: String(step.ID || step.id || ""),
                        status: "idle",
                        config: step.Config || step.config || {},
                    },
                };
            });

            const loadedEdges = workflowEdges.map((edge, index) => {
                const branch = getConditionBranch(edge);

                return {
                    id: edge.ID || edge.id || `edge-${index}`,
                    source: edge.SourceFrontendNodeID || edge.source_frontend_node_id,
                    target: edge.TargetFrontendNodeID || edge.target_frontend_node_id,
                    sourceHandle: branch || null,
                    data: { condition_branch: branch },
                    label: branch ? branch.toUpperCase() : "",
                    animated: true,
                    style: {
                        stroke: branch === "false" ? "#f87171" : T.accent,
                        strokeWidth: 2,
                    },
                };
            });

            setNodes(loadedNodes);
            setEdges(loadedEdges);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateNodeConfig = (key, value) => {
        if (!selectedNode) return;

        setNodes((nds) =>
            nds.map((node) =>
                node.id === selectedNode.id
                    ? {
                          ...node,
                          data: {
                              ...node.data,
                              config: {
                                  ...node.data.config,
                                  [key]: value,
                              },
                          },
                      }
                    : node
            )
        );
    };

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            if (!reactFlowInstance) return;

            const type = event.dataTransfer.getData("application/reactflow");
            if (!type) return;

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const nodeId = `node-${Date.now()}`;

            const isWebhook = type === "webhookTrigger";
            const isCondition = type === "conditionNode";
            const isDelay = type === "delayNode";
            const isEmail = type === "emailNode";

            const newNode = {
                id: nodeId,
                type,
                position,
                data: {
                    label: isWebhook
                        ? "Webhook Trigger"
                        : isCondition
                        ? "Condition"
                        : isDelay
                        ? "Delay"
                        : isEmail
                        ? "Email"
                        : "HTTP Request",
                    status: "idle",
                    config: isWebhook
                        ? {}
                        : isCondition
                        ? { field: "", operator: "equals", value: "" }
                        : isDelay
                        ? { duration: 5, unit: "second" }
                        : isEmail
                        ? { to: "", subject: "", body: "" }
                        : {
                              url: "",
                              method: "GET",
                              body: "",
                              timeout_seconds: 15,
                              retry: {
                                  enabled: false,
                                  max_attempts: 3,
                                  delay_seconds: 2,
                              },
                          },
                },
            };

            setNodes((nds) => nds.concat(newNode));
            setSelectedNode(newNode);
        },
        [reactFlowInstance, setNodes]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const deleteSelectedNode = () => {
        if (!selectedNode) return;

        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
        setEdges((eds) =>
            eds.filter(
                (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
            )
        );

        setSelectedNode(null);
        showToast("Node deleted", "success");
    };

    const handleSaveWorkflow = async () => {
        try {
            setSaving(true);
            setError("");

            const steps = nodes.map((node, index) => ({
                frontend_node_id: node.id,
                step_order: index + 1,
                step_type:
                    node.type === "webhookTrigger"
                        ? "webhook_trigger"
                        : node.type === "conditionNode"
                        ? "condition"
                        : node.type === "delayNode"
                        ? "delay"
                        : node.type === "emailNode"
                        ? "email"
                        : "http_request",
                config: node.data.config,
            }));

            const workflowEdges = edges.map((edge) => ({
                source: edge.source,
                target: edge.target,
                condition_branch:
                    edge.sourceHandle === "true"
                        ? "true"
                        : edge.sourceHandle === "false"
                        ? "false"
                        : "",
            }));

            await api.saveWorkflowSteps(workflowId, steps, workflowEdges);
            await fetchWorkflowSteps();

            showToast("Workflow saved", "success");
        } catch (err) {
            setError(err.message);
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!selectedNode) return;

        const updated = nodes.find((n) => n.id === selectedNode.id);

        if (updated && updated !== selectedNode) {
            setSelectedNode(updated);
        }
    }, [nodes]);

    return {
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        selectedNode,
        setSelectedNode,
        sidebarAnimating,
        setSidebarAnimating,
        reactFlowInstance,
        setReactFlowInstance,
        saving,
        onConnect,
        onDrop,
        onDragOver,
        onDragStart,
        updateNodeConfig,
        deleteSelectedNode,
        fetchWorkflowSteps,
        handleSaveWorkflow,
    };
}
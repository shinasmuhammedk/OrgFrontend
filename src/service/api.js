import API_BASE_URL from "../config/api";

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getToken() {
        return localStorage.getItem("token");
    }

    getAuthHeaders() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken()}`,
        };
    }

    async signup(email, password, name) {
        const res = await fetch(`${this.baseURL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Signup failed");
        }

        return data;
    }

    async login(email, password) {
        const res = await fetch(`${this.baseURL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Login failed");
        }

        return data;
    }

    async getWorkflows() {
        const res = await fetch(`${this.baseURL}/workflows`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch workflows");
        }

        return data;
    }

    async getWorkflowRuns(workflowId) {
        const res = await fetch(`${this.baseURL}/workflows/${workflowId}/runs`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch workflow runs");
        }

        return data;
    }

    async runWorkflow(workflowId) {
        const res = await fetch(`${this.baseURL}/workflows/${workflowId}/run`, {
            method: "POST",
            headers: this.getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to run workflow");
        }

        return data;
    }

    async saveWorkflowSteps(workflowId, steps, edges) {
        const res = await fetch(`${this.baseURL}/workflows/${workflowId}/steps`, {
            method: "PUT",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ steps, edges }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to save workflow steps");
        }

        return data;
    }

    async getWorkflowSteps(workflowId) {
        const res = await fetch(`${this.baseURL}/workflows/${workflowId}/steps`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch workflow steps");
        }

        return data;
    }

    async getWorkflowEdges(workflowId) {
        const res = await fetch(`${this.baseURL}/workflows/${workflowId}/edges`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch workflow edges");
        }

        return data;
    }

    async getWorkflowStepRuns(workflowRunId) {
        const res = await fetch(
            `${this.baseURL}/workflow-runs/${workflowRunId}/steps`,
            {
                method: "GET",
                headers: this.getAuthHeaders(),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch step logs");
        }

        return data;
    }
}

export default new ApiService();
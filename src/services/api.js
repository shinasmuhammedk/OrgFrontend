import API_BASE_URL from "../config/api";

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getToken() {
        return localStorage.getItem("token");
    }

    getAuthHeaders() {
        const headers = {
            "Content-Type": "application/json",
        };

        const token = this.getToken();

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const res = await fetch(`${this.baseURL}${endpoint}`, options);

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem("token");
            }

            throw new Error(data.message || data.error || "Request failed");
        }

        return data;
    }

    signup(email, password, name) {
        return this.request("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name }),
        });
    }

    login(email, password) {
        return this.request("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
    }

    getWorkflows() {
        return this.request("/workflows", {
            method: "GET",
            headers: this.getAuthHeaders(),
        });
    }

    createWorkflow(name, description) {
        return this.request("/workflows", {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ name, description }),
        });
    }


    getWorkflowRuns(workflowId) {
        return this.request(`/workflows/${workflowId}/runs`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });
    }

    runWorkflow(workflowId) {
        return this.request(`/workflows/${workflowId}/run`, {
            method: "POST",
            headers: this.getAuthHeaders(),
        });
    }

    saveWorkflowSteps(workflowId, steps, edges) {
        return this.request(`/workflows/${workflowId}/steps`, {
            method: "PUT",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ steps, edges }),
        });
    }

    getWorkflowSteps(workflowId) {
        return this.request(`/workflows/${workflowId}/steps`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });
    }

    getWorkflowEdges(workflowId) {
        return this.request(`/workflows/${workflowId}/edges`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });
    }

    getWorkflowStepRuns(workflowRunId) {
        return this.request(`/workflow-runs/${workflowRunId}/steps`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });
    }
}

export default new ApiService();
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

        if (res.status === 401 && !options._retry) {
            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
                const refreshRes = await fetch(`${this.baseURL}/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });

                const refreshData = await refreshRes.json();

                if (refreshRes.ok) {
                    localStorage.setItem("token", refreshData.data.access_token);
                    localStorage.setItem("refresh_token", refreshData.data.refresh_token);

                    return this.request(endpoint, {
                        ...options,
                        _retry: true,
                        headers: this.getAuthHeaders(),
                    });
                }
            }

            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
        }

        if (!res.ok) {
            throw new Error(data.message || data.error || "Request failed");
        }

        return data;
    }

get(endpoint) {
    return this.request(endpoint, {
        method: "GET",
        headers: this.getAuthHeaders(),
    });
}

post(endpoint, body) {
    return this.request(endpoint, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
    });
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

createWorkflow(data) {
    return this.request("/workflows", {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
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

deleteWorkflow(workflowId) {
    return this.request(`/workflows/${workflowId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
    });
}

updateWorkflow(workflowId, data) {
    return this.request(`/workflows/${workflowId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
    });
}
}

export default new ApiService();
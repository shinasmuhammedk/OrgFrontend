import API_BASE_URL from "../config/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
}

export default new ApiService();
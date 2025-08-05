const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

class AuthService {
  async register(email, password, organizationName) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, organizationName }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    localStorage.setItem('scvpToken', data.token);
    return data;
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    localStorage.setItem('scvpToken', data.token);
    return data;
  }

  async verifyToken() {
    const token = localStorage.getItem('scvpToken');
    if (!token) throw new Error('No token');
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    return data;
  }

  logout() {
    localStorage.removeItem('scvpToken');
  }
}

export default new AuthService();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

class ShipmentService {
  getAuthHeaders() {
    const token = localStorage.getItem('scvpToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async getShipments() {
    const response = await fetch(`${API_BASE_URL}/shipments`, {
      headers: this.getAuthHeaders(),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }

  async deleteShipment(id) {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }

  async getShipmentEvents(id) {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}/events`, {
      headers: this.getAuthHeaders(),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }

  async markAsDelivered(id, location) {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({
        event_type: 'status_change',
        status: 'delivered',
        location: location,
        event_details: { source: 'manual_delivery' }
      })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }
}

export default new ShipmentService();
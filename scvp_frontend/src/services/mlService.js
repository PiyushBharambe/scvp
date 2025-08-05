class MLService {
  constructor() {
    this.baseURL = 'http://localhost:8000';
  }

  async predictDelay(shipmentData) {
    try {
      const response = await fetch(`${this.baseURL}/predict-delay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: shipmentData.origin,
          destination: shipmentData.destination,
          supplier_id: shipmentData.supplier_id || 1,
          estimated_days: 3,
          current_status: shipmentData.status,
          distance_km: 1000
        })
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('ML service response error:', response.status);
        return this.getMockPrediction();
      }
    } catch (error) {
      console.error('ML prediction error:', error);
      return this.getMockPrediction();
    }
  }

  getMockPrediction() {
    return {
      delay_hours: Math.random() * 20 + 5,
      delay_probability: Math.random() * 0.6 + 0.2,
      risk_level: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)]
    };
  }

  async batchPredict(shipments) {
    const predictions = {};
    
    for (const shipment of shipments) {
      if (!['delivered', 'cancelled'].includes(shipment.status)) {
        const prediction = await this.predictDelay(shipment);
        if (prediction) {
          predictions[shipment.id] = prediction;
        }
      }
    }
    
    return predictions;
  }
}

export default new MLService();
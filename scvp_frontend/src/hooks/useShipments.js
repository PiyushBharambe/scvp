import { useState, useEffect, useCallback } from 'react';
import shipmentService from '../services/shipmentService';
import mlService from '../services/mlService';
import { POLLING_INTERVALS } from '../constants';

export const useShipments = (token, user) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mlPredictions, setMlPredictions] = useState({});

  const fetchShipments = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    
    try {
      const data = await shipmentService.getShipments();
      setShipments(data);
      
      // Fetch ML predictions
      const predictions = await mlService.batchPredict(data);
      
      // Add hardcoded predictions for demo
      data.forEach(shipment => {
        if (!['delivered', 'cancelled'].includes(shipment.status)) {
          predictions[shipment.id] = predictions[shipment.id] || mlService.getMockPrediction();
        }
      });
      
      setMlPredictions(predictions);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError(err.message || 'Network error fetching shipments.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const deleteShipment = useCallback(async (shipmentId) => {
    try {
      await shipmentService.deleteShipment(shipmentId);
      setShipments(prev => prev.filter(s => s.id !== shipmentId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting shipment:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const markAsDelivered = useCallback(async (shipmentId, destination) => {
    try {
      await shipmentService.markAsDelivered(shipmentId, destination);
      await fetchShipments(false);
      return { success: true };
    } catch (err) {
      console.error('Error marking as delivered:', err);
      return { success: false, error: err.message };
    }
  }, [fetchShipments]);

  useEffect(() => {
    if (token && user) {
      fetchShipments();
      
      // Set up polling
      const interval = setInterval(() => {
        fetchShipments(false);
      }, POLLING_INTERVALS.SHIPMENTS_REFRESH);
      
      // Listen for manual refresh events
      const handleRefresh = () => fetchShipments(false);
      window.addEventListener('refreshShipments', handleRefresh);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('refreshShipments', handleRefresh);
      };
    }
  }, [token, user, fetchShipments]);

  return {
    shipments,
    loading,
    error,
    mlPredictions,
    fetchShipments,
    deleteShipment,
    markAsDelivered
  };
};
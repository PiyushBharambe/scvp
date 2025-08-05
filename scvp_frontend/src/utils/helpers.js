// Utility Helper Functions

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

export const generateTrackingId = () => {
  return `SHIP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
};

export const capitalizeStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').toUpperCase();
};

export const getStatusDotColor = (status) => {
  const colors = {
    delivered: 'bg-green-400',
    in_transit: 'bg-blue-400',
    delayed: 'bg-red-400',
    pending: 'bg-yellow-400',
    cancelled: 'bg-gray-400'
  };
  return colors[status] || 'bg-gray-400';
};

export const checkForAlerts = (shipment) => {
  const now = new Date();
  let alerts = [];
  
  if (shipment.current_location && shipment.last_location_update_at) {
    const lastUpdate = new Date(shipment.last_location_update_at);
    const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (
      timeSinceLastUpdate > twentyFourHours &&
      shipment.status !== 'delivered' &&
      shipment.status !== 'cancelled'
    ) {
      alerts.push(
        `Location not updated for over 24 hours. Last update: ${lastUpdate.toLocaleString()}`
      );
    }
  }
  
  if (
    shipment.estimated_arrival_at &&
    shipment.status !== 'delivered' &&
    shipment.status !== 'cancelled'
  ) {
    const eta = new Date(shipment.estimated_arrival_at);
    if (now > eta) {
      alerts.push(
        `Estimated arrival time has passed. ETA: ${eta.toLocaleString()}`
      );
    }
  }
  
  return alerts;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
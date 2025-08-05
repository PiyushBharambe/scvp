const authService = require('./authService');
const shipmentService = require('./shipmentService');
const logger = require('../utils/logger');
const { ROUTES } = require('../config/constants');

class GPSSimulationService {
  constructor() {
    this.isRunning = false;
    this.interval = null;
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    logger.info('🛰️ Starting automatic GPS simulation (every 2 minutes)');
    
    // Start after 5 seconds
    setTimeout(() => this.simulate(), 5000);
    
    // Run every 2 minutes
    this.interval = setInterval(() => this.simulate(), 2 * 60 * 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    logger.info('🛰️ GPS simulation stopped');
  }

  async simulate() {
    try {
      // Login as admin to get token
      const { token } = await authService.login('admin@test.com', 'testpassword');
      
      // Get all shipments
      const shipments = await shipmentService.getAllShipments(1); // Assuming org ID 1
      const activeShipments = shipments.filter(s => !['delivered', 'cancelled'].includes(s.status));
      
      for (const shipment of activeShipments) {
        await this.simulateShipmentGPS(shipment);
      }
      
      if (activeShipments.length > 0) {
        logger.info(`📡 GPS simulation completed for ${activeShipments.length} active shipments`);
      } else {
        logger.info('📦 No active shipments found for GPS simulation');
      }
    } catch (error) {
      logger.error('GPS simulation error:', error.message);
    }
  }

  async simulateShipmentGPS(shipment) {
    try {
      // Get current location index from shipment events
      const events = await shipmentService.getShipmentEvents(shipment.id);
      
      // Find appropriate route based on origin/destination
      let route = ROUTES['Mumbai → Pune']; // default
      if (shipment.origin?.includes('Delhi') || shipment.destination?.includes('Bangalore')) {
        route = ROUTES['Delhi → Bangalore'];
      } else if (shipment.origin?.includes('Chennai') || shipment.destination?.includes('Kolkata')) {
        route = ROUTES['Chennai → Kolkata'];
      }
      
      // Find current position in route
      let currentIndex = 0;
      const lastGPSEvent = events.filter(e => e.event_type === 'gps_update').pop();
      if (lastGPSEvent) {
        const currentLocation = lastGPSEvent.location;
        currentIndex = route.findIndex(loc => currentLocation?.includes(loc));
        if (currentIndex === -1) currentIndex = 0;
      }
      
      // Move to next location in sequence
      const nextIndex = Math.min(currentIndex + 1, route.length - 1);
      const nextLocation = route[nextIndex];
      
      // Check if reached destination
      const isDelivered = nextIndex === route.length - 1;
      
      // Skip if already delivered
      if (shipment.status === 'delivered') return;
      
      // Determine status based on estimated delivery time
      let status;
      if (isDelivered) {
        status = 'delivered';
      } else {
        const now = new Date();
        const estimatedDelivery = shipment.estimated_arrival_at ? new Date(shipment.estimated_arrival_at) : null;
        
        if (estimatedDelivery && now > estimatedDelivery) {
          status = 'delayed'; // Past estimated delivery time
        } else {
          status = 'in_transit'; // Still within estimated time
        }
      }
      
      // Create GPS event
      await shipmentService.createShipmentEvent(shipment.id, {
        event_type: 'gps_update',
        location: nextLocation,
        status: status,
        event_details: { 
          source: 'auto_gps_simulator', 
          route_progress: `${nextIndex + 1}/${route.length}` 
        }
      });
      
      logger.info(`🛰️ GPS Update: ${shipment.tracking_id} → ${nextLocation} (${status}) [${nextIndex + 1}/${route.length}]`);
    } catch (error) {
      logger.error(`GPS simulation error for shipment ${shipment.id}:`, error.message);
    }
  }
}

module.exports = new GPSSimulationService();
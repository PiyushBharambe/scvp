const shipmentService = require('../services/shipmentService');
const logger = require('../utils/logger');

class ShipmentController {
  async getAllShipments(req, res) {
    try {
      const shipments = await shipmentService.getAllShipments(req.user.organization_id);
      res.status(200).json(shipments);
    } catch (error) {
      logger.error('Error fetching shipments', { error: error.message });
      res.status(500).json({
        message: 'Server error fetching shipments',
        error: error.message,
      });
    }
  }

  async getShipmentById(req, res) {
    try {
      const shipment = await shipmentService.getShipmentById(
        req.params.id,
        req.user.organization_id
      );
      res.status(200).json(shipment);
    } catch (error) {
      logger.error('Error fetching single shipment', { error: error.message });
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        message: error.message,
      });
    }
  }

  async createShipment(req, res) {
    try {
      const newShipment = await shipmentService.createShipment(
        req.body,
        req.user.organization_id
      );
      res.status(201).json(newShipment);
    } catch (error) {
      logger.error('Error creating shipment', { error: error.message });
      const statusCode = error.message.includes('provide') ? 400 : 500;
      res.status(statusCode).json({
        message: error.message,
      });
    }
  }

  async updateShipment(req, res) {
    try {
      const updatedShipment = await shipmentService.updateShipment(
        req.params.id,
        req.body,
        req.user.organization_id
      );
      res.status(200).json(updatedShipment);
    } catch (error) {
      logger.error('Error updating shipment', { error: error.message });
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        message: error.message,
      });
    }
  }

  async deleteShipment(req, res) {
    try {
      const result = await shipmentService.deleteShipment(
        req.params.id,
        req.user.organization_id
      );
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error deleting shipment', { error: error.message });
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        message: error.message,
      });
    }
  }

  async getShipmentEvents(req, res) {
    try {
      const events = await shipmentService.getShipmentEvents(
        req.params.id,
        req.user.organization_id
      );
      res.status(200).json(events);
    } catch (error) {
      logger.error('Error fetching shipment events', { error: error.message });
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        message: error.message,
      });
    }
  }

  async createShipmentEvent(req, res) {
    try {
      const newEvent = await shipmentService.createShipmentEvent(
        req.params.id,
        req.body,
        req.user.organization_id
      );
      res.status(201).json(newEvent);
    } catch (error) {
      logger.error('Error logging shipment event', { error: error.message });
      const statusCode = error.message.includes('required') ? 400 : 
                        error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        message: error.message,
      });
    }
  }
}

module.exports = new ShipmentController();
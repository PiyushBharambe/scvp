const Shipment = require('../db/models/Shipment');
const ShipmentEvent = require('../db/models/ShipmentEvent');
const { getCache, setCache, deleteCache } = require('../utils/cache');
const logger = require('../utils/logger');

class ShipmentService {
  async getAllShipments(organizationId) {
    const cacheKey = `shipments:${organizationId}`;
    
    let shipments = await getCache(cacheKey);
    
    if (!shipments) {
      shipments = await Shipment.query()
        .where('organization_id', organizationId)
        .withGraphFetched('[supplier, customer, events]')
        .orderBy('created_at', 'desc');
      
      await setCache(cacheKey, shipments, 300);
    }
    
    return shipments;
  }

  async getShipmentById(id, organizationId) {
    const shipment = await Shipment.query()
      .where('id', id)
      .andWhere('organization_id', organizationId)
      .withGraphFetched('[supplier, customer, events]')
      .first();

    if (!shipment) {
      throw new Error('Shipment not found or you do not have access');
    }

    return shipment;
  }

  async createShipment(shipmentData, organizationId) {
    const {
      tracking_id,
      type,
      description,
      origin,
      destination,
      scheduled_pickup_at,
      estimated_arrival_at,
      supplier_id,
      customer_id,
    } = shipmentData;

    if (!tracking_id || !type || !origin || !destination) {
      throw new Error('Please provide tracking_id, type, origin, and destination');
    }

    const newShipment = await Shipment.query().insert({
      organization_id: organizationId,
      tracking_id,
      type,
      description,
      origin,
      destination,
      scheduled_pickup_at,
      estimated_arrival_at,
      supplier_id,
      customer_id,
      status: 'pending',
    });

    // Clear cache
    await deleteCache(`shipments:${organizationId}`);

    return newShipment;
  }

  async updateShipment(id, shipmentData, organizationId) {
    const {
      current_location,
      status,
      actual_pickup_at,
      actual_arrival_at,
      estimated_arrival_at,
      description,
      type,
      origin,
      destination,
      supplier_id,
      customer_id,
    } = shipmentData;

    const updatedShipment = await Shipment.query()
      .patchAndFetchById(id, {
        current_location,
        status,
        actual_pickup_at,
        actual_arrival_at,
        estimated_arrival_at,
        description,
        type,
        origin,
        destination,
        supplier_id,
        customer_id,
        updated_at: new Date().toISOString(),
      })
      .where('organization_id', organizationId);

    if (!updatedShipment) {
      throw new Error('Shipment not found or you do not have access');
    }

    // Log event if location or status changed
    if (current_location || status) {
      await this.createShipmentEvent(updatedShipment.id, {
        event_type: current_location ? 'location_update' : 'status_change',
        location: current_location || updatedShipment.current_location,
        status: status || updatedShipment.status,
        event_details: { updated_by: 'system' },
      });

      if (current_location) {
        await Shipment.query()
          .patch({ last_location_update_at: new Date().toISOString() })
          .where('id', updatedShipment.id);
      }
    }

    // Clear cache
    await deleteCache(`shipments:${organizationId}`);

    return updatedShipment;
  }

  async deleteShipment(id, organizationId) {
    const deletedCount = await Shipment.query()
      .delete()
      .where('id', id)
      .andWhere('organization_id', organizationId);

    if (deletedCount === 0) {
      throw new Error('Shipment not found or you do not have access');
    }

    // Clear cache
    await deleteCache(`shipments:${organizationId}`);

    return { message: 'Shipment deleted successfully' };
  }

  async getShipmentEvents(shipmentId, organizationId) {
    // Verify shipment belongs to organization
    const shipment = await Shipment.query()
      .where('id', shipmentId)
      .andWhere('organization_id', organizationId)
      .first();

    if (!shipment) {
      throw new Error('Shipment not found or you do not have access');
    }

    const events = await ShipmentEvent.query()
      .where('shipment_id', shipmentId)
      .orderBy('event_timestamp', 'desc');

    return events;
  }

  async createShipmentEvent(shipmentId, eventData, organizationId = null) {
    const { event_type, location, status, event_details } = eventData;

    if (!event_type) {
      throw new Error('Event type is required');
    }

    // Verify shipment exists and belongs to organization (if provided)
    const whereClause = { id: shipmentId };
    if (organizationId) {
      whereClause.organization_id = organizationId;
    }

    const shipment = await Shipment.query().where(whereClause).first();

    if (!shipment) {
      throw new Error('Shipment not found or you do not have access');
    }

    const newEvent = await ShipmentEvent.query().insert({
      shipment_id: shipmentId,
      event_type,
      location: location || shipment.current_location,
      status: status || shipment.status,
      event_details: event_details || {},
    });

    // Update shipment if needed
    const patchData = {};
    if (location && location !== shipment.current_location) {
      patchData.current_location = location;
      patchData.last_location_update_at = new Date().toISOString();
    }
    if (status && status !== shipment.status) {
      patchData.status = status;
    }

    if (Object.keys(patchData).length > 0) {
      await Shipment.query().patch(patchData).where('id', shipmentId);
    }

    // Cleanup old GPS events
    if (event_type === 'gps_update') {
      await this.cleanupOldGPSEvents(shipmentId);
    }

    return newEvent;
  }

  async cleanupOldGPSEvents(shipmentId) {
    const gpsEvents = await ShipmentEvent.query()
      .where('shipment_id', shipmentId)
      .andWhere('event_type', 'gps_update')
      .orderBy('event_timestamp', 'desc');
    
    if (gpsEvents.length > 3) {
      const eventsToDelete = gpsEvents.slice(3);
      const idsToDelete = eventsToDelete.map(e => e.id);
      await ShipmentEvent.query().delete().whereIn('id', idsToDelete);
      logger.info(`Deleted ${idsToDelete.length} old GPS events for shipment ${shipmentId}`);
    }
  }
}

module.exports = new ShipmentService();
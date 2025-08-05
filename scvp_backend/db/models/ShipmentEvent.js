const { Model } = require("objection");

class ShipmentEvent extends Model {
  static get tableName() {
    return "shipment_events";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["shipment_id", "event_type"],
      properties: {
        id: { type: "string", format: "uuid" },
        shipment_id: { type: "string", format: "uuid" },
        event_type: { type: "string", minLength: 1, maxLength: 100 },
        location: { type: ["string", "null"], maxLength: 255 },
        status: { type: ["string", "null"], maxLength: 50 },
        event_details: { type: ["object", "null"] }, // JSONB type
        event_timestamp: { type: "string", format: "date-time" },
        created_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const Shipment = require("./Shipment");
    return {
      shipment: {
        relation: Model.BelongsToOneRelation,
        modelClass: Shipment,
        join: {
          from: "shipment_events.shipment_id",
          to: "shipments.id",
        },
      },
    };
  }
}

module.exports = ShipmentEvent;

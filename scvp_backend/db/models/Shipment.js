// db/models/Shipment.js
const { Model } = require("objection");

class Shipment extends Model {
  static get tableName() {
    return "shipments";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "organization_id",
        "tracking_id",
        "type",
        "origin",
        "destination",
      ],
      properties: {
        id: { type: "string", format: "uuid" },
        organization_id: { type: "string", format: "uuid" },
        tracking_id: { type: "string", minLength: 1, maxLength: 255 },
        type: {
          type: "string",
          enum: ["inbound_raw_materials", "outbound_finished_goods"],
        },
        description: { type: ["string", "null"] },
        origin: { type: "string", minLength: 1, maxLength: 255 },
        destination: { type: "string", minLength: 1, maxLength: 255 },
        scheduled_pickup_at: { type: ["string", "null"], format: "date-time" },
        actual_pickup_at: { type: ["string", "null"], format: "date-time" },
        estimated_arrival_at: { type: ["string", "null"], format: "date-time" },
        actual_arrival_at: { type: ["string", "null"], format: "date-time" },
        current_location: { type: ["string", "null"], maxLength: 255 },
        status: {
          type: "string",
          enum: ["pending", "in_transit", "delayed", "delivered", "cancelled"],
          default: "pending",
        },
        supplier_id: { type: ["string", "null"], format: "uuid" },
        customer_id: { type: ["string", "null"], format: "uuid" },
        last_location_update_at: {
          type: ["string", "null"],
          format: "date-time",
        },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const Organization = require("./Organization");
    const Supplier = require("./Supplier"); // <--- CORRECTED PATH: points to db/models/Supplier.js
    const Customer = require("./Customer");
    const ShipmentEvent = require("./ShipmentEvent");

    return {
      organization: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organization,
        join: {
          from: "shipments.organization_id",
          to: "organizations.id",
        },
      },
      supplier: {
        relation: Model.BelongsToOneRelation,
        modelClass: Supplier,
        join: {
          from: "shipments.supplier_id",
          to: "suppliers.id",
        },
      },
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: "shipments.customer_id",
          to: "customers.id",
        },
      },
      events: {
        relation: Model.HasManyRelation,
        modelClass: ShipmentEvent,
        join: {
          from: "shipments.id",
          to: "shipment_events.shipment_id",
        },
      },
    };
  }
}

module.exports = Shipment;

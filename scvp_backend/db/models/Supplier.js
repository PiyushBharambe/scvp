// db/models/Supplier.js
const { Model } = require("objection");

class Supplier extends Model {
  static get tableName() {
    return "suppliers";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["organization_id", "name"],
      properties: {
        id: { type: "string", format: "uuid" },
        organization_id: { type: "string", format: "uuid" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        contact_person: { type: ["string", "null"] },
        contact_email: { type: ["string", "null"], format: "email" },
        phone_number: { type: ["string", "null"], maxLength: 50 },
        address: { type: ["string", "null"] },
        performance_score: { type: ["integer", "null"] },
        performance_grade: { type: ["string", "null"] },
        last_score_update: { type: ["string", "null"], format: "date-time" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const Organization = require("./Organization"); // Require related model
    const Shipment = require("./Shipment"); // Require related model
    return {
      organization: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organization,
        join: {
          from: "suppliers.organization_id",
          to: "organizations.id",
        },
      },
      shipments: {
        relation: Model.HasManyRelation,
        modelClass: Shipment,
        join: {
          from: "suppliers.id",
          to: "shipments.supplier_id",
        },
      },
    };
  }
}

module.exports = Supplier;

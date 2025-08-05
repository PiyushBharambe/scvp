// db/models/Organization.js
const { Model } = require("objection");

class Organization extends Model {
  static get tableName() {
    return "organizations";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        address: { type: ["string", "null"] },
        contact_email: { type: ["string", "null"], format: "email" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const User = require("./User");
    const Supplier = require("./Supplier"); // <--- CORRECTED PATH: points to db/models/Supplier.js
    const Customer = require("./Customer");
    const Shipment = require("./Shipment");

    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "organizations.id",
          to: "users.organization_id",
        },
      },
      suppliers: {
        relation: Model.HasManyRelation,
        modelClass: Supplier,
        join: {
          from: "organizations.id",
          to: "suppliers.organization_id",
        },
      },
      customers: {
        relation: Model.HasManyRelation,
        modelClass: Customer,
        join: {
          from: "organizations.id",
          to: "customers.organization_id",
        },
      },
      shipments: {
        relation: Model.HasManyRelation,
        modelClass: Shipment,
        join: {
          from: "organizations.id",
          to: "shipments.organization_id",
        },
      },
    };
  }
}

module.exports = Organization;

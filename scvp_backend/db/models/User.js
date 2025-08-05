const { Model } = require("objection");
const bcrypt = require("bcryptjs");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password_hash"],
      properties: {
        id: { type: "string", format: "uuid" },
        email: { type: "string", format: "email", maxLength: 255 },
        password_hash: { type: "string", maxLength: 255 },
        role: {
          type: "string",
          enum: ["admin", "logistics_manager"],
          default: "logistics_manager",
        },
        organization_id: { type: ["string", "null"], format: "uuid" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const Organization = require("./Organization");
    return {
      organization: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organization,
        join: {
          from: "users.organization_id",
          to: "organizations.id",
        },
      },
    };
  }

  // Helper method to hash password before inserting/updating
  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    if (this.password_hash) {
      this.password_hash = await bcrypt.hash(this.password_hash, 10);
    }
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    if (this.password_hash && this.isChanged("password_hash")) {
      this.password_hash = await bcrypt.hash(this.password_hash, 10);
    }
  }

  // Helper method to compare password
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password_hash);
  }
}

module.exports = User;
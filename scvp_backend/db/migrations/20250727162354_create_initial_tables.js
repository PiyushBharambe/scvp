// db/migrations/20250727162354_create_initial_tables.js
// Migration to create initial database tables for SCVP

exports.up = async function (knex) {
  // Create organizations table
  await knex.schema.createTable("organizations", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name", 255).notNullable().unique();
    table.text("address");
    table.string("contact_email", 255);
    table.timestamps(true, true); // Adds created_at and updated_at
  });

  // Create users table
  await knex.schema.createTable("users", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("email", 255).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("role", 50).notNullable().defaultTo("logistics_manager");
    table.uuid("organization_id");
    table
      .foreign("organization_id")
      .references("id")
      .inTable("organizations")
      .onDelete("SET NULL");
    table.timestamps(true, true);
  });

  // Create suppliers table
  await knex.schema.createTable("suppliers", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("organization_id").notNullable();
    table
      .foreign("organization_id")
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");
    table.string("name", 255).notNullable();
    table.string("contact_person", 255);
    table.string("contact_email", 255);
    table.string("phone_number", 50);
    table.text("address");
    table.timestamps(true, true);
  });

  // Create customers table
  await knex.schema.createTable("customers", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("organization_id").notNullable();
    table
      .foreign("organization_id")
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");
    table.string("name", 255).notNullable();
    table.string("contact_person", 255);
    table.string("contact_email", 255);
    table.string("phone_number", 50);
    table.text("address");
    table.timestamps(true, true);
  });

  // Create shipments table
  await knex.schema.createTable("shipments", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("organization_id").notNullable();
    table
      .foreign("organization_id")
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");
    table.string("tracking_id", 255).notNullable().unique();
    table.string("type", 50).notNullable(); // e.g., 'inbound_raw_materials', 'outbound_finished_goods'
    table.text("description");
    table.string("origin", 255).notNullable();
    table.string("destination", 255).notNullable();
    table.timestamp("scheduled_pickup_at", { useTz: true });
    table.timestamp("actual_pickup_at", { useTz: true });
    table.timestamp("estimated_arrival_at", { useTz: true });
    table.timestamp("actual_arrival_at", { useTz: true });
    table.string("current_location", 255);
    table.string("status", 50).notNullable().defaultTo("pending"); // e.g., 'pending', 'in_transit', 'delayed', 'delivered', 'cancelled'
    table.uuid("supplier_id");
    table
      .foreign("supplier_id")
      .references("id")
      .inTable("suppliers")
      .onDelete("SET NULL");
    table.uuid("customer_id");
    table
      .foreign("customer_id")
      .references("id")
      .inTable("customers")
      .onDelete("SET NULL");
    table.timestamp("last_location_update_at", { useTz: true });
    table.timestamps(true, true);
  });

  // Create shipment_events table
  await knex.schema.createTable("shipment_events", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("shipment_id").notNullable();
    table
      .foreign("shipment_id")
      .references("id")
      .inTable("shipments")
      .onDelete("CASCADE");
    table.string("event_type", 100).notNullable(); // e.g., 'location_update', 'status_change', 'delay_alert'
    table.string("location", 255);
    table.string("status", 50);
    table.jsonb("event_details"); // Flexible JSONB field
    table
      .timestamp("event_timestamp", { useTz: true })
      .defaultTo(knex.fn.now());
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  // Drop tables in reverse order of creation to handle foreign key constraints
  await knex.schema.dropTableIfExists("shipment_events");
  await knex.schema.dropTableIfExists("shipments");
  await knex.schema.dropTableIfExists("customers");
  await knex.schema.dropTableIfExists("suppliers");
  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("organizations");
};

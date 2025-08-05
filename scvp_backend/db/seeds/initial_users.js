const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // Import crypto module for UUID generation

exports.seed = async function (knex) {
  // Deletes ALL existing entries in the 'users' and 'organizations' tables
  // Order matters: delete users first if they have foreign keys to organizations
  await knex("users").del();
  await knex("organizations").del();

  // Generate UUIDs for the new organization and user
  const organizationId = crypto.randomUUID();
  const userId = crypto.randomUUID();

  // Hash the password
  const hashedPassword = await bcrypt.hash("testpassword", 10);

  // Insert seed entries
  await knex("organizations").insert([
    {
      id: organizationId, // Use generated UUID
      name: "Global Logistics Inc.",
      address: "123 Main St, Anytown",
      contact_email: "contact@global.com",
    },
  ]);

  await knex("users").insert([
    {
      id: userId,
      organization_id: organizationId,
      email: "admin@test.com",
      password_hash: hashedPassword,
      role: "admin",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  console.log(
    "Seed data inserted: admin user and Global Logistics Inc. organization into supply_chain_visibility database."
  ); // Updated log
};

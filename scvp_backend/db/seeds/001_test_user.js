const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Clear existing entries
  await knex('users').del();
  await knex('organizations').del();

  // Insert organization
  const [org] = await knex('organizations').insert({
    id: knex.raw('gen_random_uuid()'),
    name: 'Test Organization',
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  }).returning('*');

  // Hash password
  const hashedPassword = await bcrypt.hash('testpassword', 10);

  // Insert test user
  await knex('users').insert({
    id: knex.raw('gen_random_uuid()'),
    email: 'admin@test.com',
    password_hash: hashedPassword,
    role: 'admin',
    organization_id: org.id,
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  });

  console.log('Test user created: admin@test.com / testpassword');
};
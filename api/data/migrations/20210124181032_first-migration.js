exports.up = async (knex) => {
  await knex.schema
  .createTable('roles', (roles) => {
    roles.increments('role_id')
    roles.string('role_name', 200)
    .notNullable()
    .unique();
    roles.string('role_description', 200);
    roles.timestamp('role_created_at')
    .defaultTo(knex.fn.now());  
    roles.timestamp('role_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('users', (users) => {
    users.increments('user_id')
    users.string('user_username')
    .notNullable()
    .unique();
    users.string('user_email')
    .notNullable();
    users.string('user_password');

    users.integer('role_id')
    .unsigned()
    .notNullable()
    .references('role_id')
    .inTable('roles')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    users.timestamp('user_created_at')
    .defaultTo(knex.fn.now());  
    users.timestamp('user_modified_at')
    .defaultTo(knex.fn.now());
  })
  ;
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('roles');
};

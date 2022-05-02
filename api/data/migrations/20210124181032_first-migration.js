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
    
    users.string('user_display_name');
    
    users.string('user_bio', 200);

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
  .createTable('cuisine_types', cuisine_types => {
    cuisine_types.increments('cuisine_type_id');
    cuisine_types.string('cuisine_type_name')
    .unique()
    .notNullable();
    cuisine_types.timestamp('cuisine_type_created_at')
    .defaultTo(knex.fn.now());  
    cuisine_types.timestamp('cuisine_type_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('ingredient_types', ingredient_types => {
    ingredient_types.increments('ingredient_type_id');
    ingredient_types.string('ingredient_type_name');
    ingredient_types.timestamp('ingredient_type_created_at')
    .defaultTo(knex.fn.now());  
    ingredient_types.timestamp('ingredient_type_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('measurement_units', measurement_units => {
    measurement_units.increments('measurement_unit_id');
    measurement_units.string('measurement_unit_name')
    .notNullable()
    .unique();
    measurement_units.timestamp('measurement_unit_created_at')
    .defaultTo(knex.fn.now());  
    measurement_units.timestamp('measurement_unit_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('ingredients', ingredients => {
    ingredients.increments('ingredient_id');
    ingredients.string('ingredient_name');

    ingredients.integer('ingredient_type_id')
    .unsigned()
    .notNullable()
    .references('ingredient_type_id')
    .inTable('ingredient_types')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    ingredients.timestamp('ingredient_created_at')
    .defaultTo(knex.fn.now());  
    ingredients.timestamp('ingredient_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('recipes', recipes => {
    recipes.increments('recipe_id');
    
    recipes.string('recipe_name')
    .notNullable();
    
    recipes.string('recipe_description', 200);
    
    recipes.string('recipe_difficulty');
    
    recipes.string('recipe_prep_duration');
    
    recipes.string('recipe_cook_duration');

    recipes.integer('recipe_servings')
    .notNullable();
    
    recipes.integer('cuisine_type_id') 
    .unsigned()
    .notNullable()
    .references('cuisine_type_id')
    .inTable('cuisine_types')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');
    
    recipes.integer('user_id') 
    .unsigned()
    .notNullable()
    .references('user_id')
    .inTable('users')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    recipes.timestamp('recipe_created_at')
    .defaultTo(knex.fn.now());  
    recipes.timestamp('recipe_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('recipe_steps', recipe_steps => {
    recipe_steps.increments('recipe_step_id');
    
    recipe_steps.string('recipe_step_text', 200);
    
    recipe_steps.integer('recipe_step_index')
    .notNullable();

    recipe_steps.integer('recipe_id')
    .unsigned()
    .notNullable()
    .references('recipe_id')
    .inTable('recipes')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');
    
    recipe_steps.timestamp('recipe_step_created_at')
    .defaultTo(knex.fn.now());  
    
    recipe_steps.timestamp('recipe_step_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('recipe_ingredients', recipe_ingredients => {
    recipe_ingredients.increments('recipe_ingredient_id');
    
    recipe_ingredients.decimal('recipe_ingredient_quantity');
    
    recipe_ingredients.integer('recipe_ingredient_index')
    .notNullable();

    recipe_ingredients.integer('ingredient_id')
    .unsigned()
    .notNullable()
    .references('ingredient_id')
    .inTable('ingredients')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    recipe_ingredients.integer('measurement_unit_id')
    .unsigned()
    .notNullable()
    .references('measurement_unit_id')
    .inTable('measurement_units')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');
    
    recipe_ingredients.integer('recipe_id')
    .unsigned()
    .notNullable()
    .references('recipe_id')
    .inTable('recipes')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    recipe_ingredients.timestamp('recipe_ingredient_created_at')
    .defaultTo(knex.fn.now());  
    
    recipe_ingredients.timestamp('recipe_ingredient_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('tags', tags => {
    tags.increments('tag_id');
    tags.string('tag_text')
    .notNullable()
    .unique();
    tags.timestamp('tag_created_at')
    .defaultTo(knex.fn.now());  
    tags.timestamp('tag_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('recipe_tags', recipe_tags => {
    recipe_tags.increments('recipe_tag_id');
    
    recipe_tags.integer('recipe_tag_index')
    .notNullable();
    
    recipe_tags.integer('tag_id')
    .unsigned()
    .notNullable()
    .references('tag_id')
    .inTable('tags')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');
    
    recipe_tags.integer('recipe_id')
    .unsigned()
    .notNullable()
    .references('recipe_id')
    .inTable('recipes')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    recipe_tags.timestamp('recipe_tag_created_at')
    .defaultTo(knex.fn.now());  
    recipe_tags.timestamp('recipe_tag_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('recipe_likes', recipe_likes => {
    recipe_likes.increments('recipe_like_id');
    
    recipe_likes.integer('user_id')
    .unsigned()
    .notNullable()
    .references('user_id')
    .inTable('users')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');
    
    recipe_likes.integer('recipe_id')
    .unsigned()
    .notNullable()
    .references('recipe_id')
    .inTable('recipes')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    recipe_likes.integer('recipe_like_read')
    .defaultTo(0);

    recipe_likes.timestamp('recipe_like_created_at')
    .defaultTo(knex.fn.now());  
    
    recipe_likes.timestamp('recipe_like_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('user_followings', user_followings => {
    user_followings.increments('user_following_id');
    
    user_followings.integer('followed_id') 
    .unsigned()
    .notNullable()
    .references('user_id')
    .inTable('users')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');
    
    user_followings.integer('user_id') 
    .unsigned()
    .notNullable()
    .references('user_id')
    .inTable('users')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    user_followings.timestamp('user_following_created_at')
    .defaultTo(knex.fn.now());  
    user_followings.timestamp('user_following_modified_at')
    .defaultTo(knex.fn.now());

    
  })
  .createTable('user_followers', user_followers => {
    user_followers.increments('user_follower_id');
    
    user_followers.integer('follower_id')
    .unsigned()
    .notNullable()
    .references('user_id')
    .inTable('users')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');
    
    user_followers.integer('user_id') 
    .unsigned()
    .notNullable()
    .references('user_id')
    .inTable('users')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    user_followers.timestamp('user_follower_created_at')
    .defaultTo(knex.fn.now());  
    user_followers.timestamp('user_follower_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('comments', comments => {
    comments.increments('comment_id');
    comments.text('comment_text', 200);
    comments.integer('user_id')
    .unsigned()
    .notNullable()
    .references('user_id')
    .inTable('users')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');
    comments.timestamp('comment_created_at')
    .defaultTo(knex.fn.now());
    comments.timestamp('comment_modified_at')
    .defaultTo(knex.fn.now());
  })
  .createTable('recipe_comments', recipe_comments => {
    recipe_comments.increments('recipe_comment_id');
    
    recipe_comments.integer('recipe_comment_read')
    .defaultTo(0);

    recipe_comments.integer('comment_id')
    .unsigned()
    .notNullable()
    .references('comment_id')
    .inTable('comments')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    recipe_comments.integer('recipe_id')
    .unsigned()
    .notNullable()
    .references('recipe_id')
    .inTable('recipes')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT');

    recipe_comments.timestamp('recipe_comment_created_at')
    .defaultTo(knex.fn.now());
    recipe_comments.timestamp('recipe_comment_modified_at')
    .defaultTo(knex.fn.now());
  })
  ;
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('recipe_comments');
  await knex.schema.dropTableIfExists('comments');
  await knex.schema.dropTableIfExists('user_followers');
  await knex.schema.dropTableIfExists('user_followings');
  await knex.schema.dropTableIfExists('recipe_likes');
  await knex.schema.dropTableIfExists('recipe_tags');
  await knex.schema.dropTableIfExists('tags');
  await knex.schema.dropTableIfExists('recipe_ingredients');
  await knex.schema.dropTableIfExists('recipe_steps');
  await knex.schema.dropTableIfExists('recipes');
  await knex.schema.dropTableIfExists('ingredients');
  await knex.schema.dropTableIfExists('measurement_units');
  await knex.schema.dropTableIfExists('ingredient_types');
  await knex.schema.dropTableIfExists('cuisine_types');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('roles');
};

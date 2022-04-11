const { recipe_tags } = require('../seed-data')

exports.seed = function(knex) {
  return knex('recipe_tags').insert(recipe_tags);
};
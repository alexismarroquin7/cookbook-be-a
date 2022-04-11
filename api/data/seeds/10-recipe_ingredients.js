const { recipe_ingredients } = require('../seed-data')

exports.seed = function(knex) {
  return knex('recipe_ingredients').insert(recipe_ingredients);
};
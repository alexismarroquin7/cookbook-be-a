const { recipe_steps } = require('../seed-data')

exports.seed = function(knex) {
  return knex('recipe_steps').insert(recipe_steps);
};
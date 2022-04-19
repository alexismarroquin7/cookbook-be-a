const { ingredient_types } = require('../seed-data')

exports.seed = function(knex) {
  return knex('ingredient_types').insert(ingredient_types);
};
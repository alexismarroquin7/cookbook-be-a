const { ingredients } = require('../seed-data')

exports.seed = function(knex) {
  return knex('ingredients').insert(ingredients);
};
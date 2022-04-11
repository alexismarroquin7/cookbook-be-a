const { recipes } = require('../seed-data')

exports.seed = function(knex) {
  return knex('recipes').insert(recipes);
};
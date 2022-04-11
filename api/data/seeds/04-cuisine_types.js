const { cuisine_types } = require('../seed-data')

exports.seed = function(knex) {
  return knex('cuisine_types').insert(cuisine_types);
};
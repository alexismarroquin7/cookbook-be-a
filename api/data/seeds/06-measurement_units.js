const { measurement_units } = require('../seed-data')

exports.seed = function(knex) {
  return knex('measurement_units').insert(measurement_units);
};
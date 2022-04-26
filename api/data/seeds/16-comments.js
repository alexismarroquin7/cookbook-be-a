const { comments } = require('../seed-data')

exports.seed = function(knex) {
  return knex('comments').insert(comments);
};
const { user_followers } = require('../seed-data')

exports.seed = function(knex) {
  return knex('user_followers').insert(user_followers);
};
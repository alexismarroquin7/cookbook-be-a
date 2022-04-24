const { user_followings } = require('../seed-data')

exports.seed = function(knex) {
  return knex('user_followings').insert(user_followings);
};
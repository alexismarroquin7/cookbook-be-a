const { recipe_likes } = require('../seed-data')

exports.seed = function(knex) {
  return knex('recipe_likes').insert(recipe_likes);
};
const { recipe_comments } = require('../seed-data')

exports.seed = function(knex) {
  return knex('recipe_comments').insert(recipe_comments);
};
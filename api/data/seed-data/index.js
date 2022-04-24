// first migration
const roles = require('./roles');
const users = require('./users');
const cuisine_types = require('./cuisine_types');
const ingredient_types = require('./ingredient_types');
const measurement_units = require('./measurement_units');
const ingredients = require('./ingredients');
const recipes = require('./recipes');
const recipe_steps = require('./recipe_steps');
const recipe_ingredients = require('./recipe_ingredients');
const tags = require('./tags');
const recipe_tags = require('./recipe_tags');
const recipe_likes = require('./recipe_likes');
const user_followings = require('./user_followings');
const user_followers = require('./user_followers');

module.exports = {
  roles,
  users,
  cuisine_types,
  ingredient_types,
  measurement_units,
  ingredients,
  recipes,
  recipe_steps,
  recipe_ingredients,
  tags,
  recipe_tags,
  recipe_likes,
  user_followings,
  user_followers

}
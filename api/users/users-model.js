const db = require("../data/db-config");

const UserFollower = require('../user_followers/user_followers-model');
const UserFollowing = require('../user_followings/user_followings-model');
const Recipe = require('../recipes/recipes-model');
const RecipeLike = require('../recipe_likes/recipe_likes-model');
const RecipeComment = require('../recipe_comments/recipe_comments-model');

const findAll = async (config = {}) => {
  
  const hidePassword = typeof config.hidePassword === "boolean" ? config.hidePassword : true;
  
  const rows = await db('users as u')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .orderBy('u.user_id', 'asc');

  if(rows.length === 0) return [];

  let users = rows.map(async row => {

    const followers = await UserFollower.findByUserId(row.user_id);
    const following = await UserFollowing.findByUserId(row.user_id);

    return {
      user_id: row.user_id,
      username: row.user_username,
      display_name: row.user_display_name,
      bio: row.user_bio,
      email: row.user_email,
      password: hidePassword ? undefined : row.user_password,
      created_at: row.user_created_at,
      modified_at: row.user_modified_at,

      role: {
        role_id: row.role_id,
        name: row.role_name,
        description: row.role_description,
        created_at: row.role_created_at,
        modified_at: row.role_modified_at
      },
      
      followers,
      following
    }
  })

  users = Promise.all(users);

  return users;
}

const findBy = async (filter, config = {}) => {

  const hidePassword = typeof config.hidePassword === "boolean" ? config.hidePassword : true;

  const rows = await db('users as u')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .where(filter)
  .orderBy('u.user_id', 'asc');

  if(rows.length === 0) return [];

  const users = Promise.all(rows.map(async row => {
    const followers = await UserFollower.findByUserId(row.user_id);
    const following = await UserFollowing.findByUserId(row.user_id);
    return {
      user_id: row.user_id,
      username: row.user_username,
      display_name: row.user_display_name,
      bio: row.user_bio,
      email: row.user_email,
      password: hidePassword ? undefined : row.user_password,
      created_at: row.user_created_at,
      modified_at: row.user_modified_at,

      role: {
        role_id: row.role_id,
        name: row.role_name,
        description: row.role_description,
        created_at: row.role_created_at,
        modified_at: row.role_modified_at
      },
      followers,
      following
    }
  }))

  return users;
}

const findByUserId = async (user_id, config = {}) => {
  const users = await findBy({ user_id }, config);
  
  if(users.length === 0) return null;

  return users[0];
}

const findByEmail = async (email, config = {}) => {
  const users = await findBy({ user_email: email }, config);
  
  if(users.length === 0) return null;

  return users[0];
}

const findByUsername = async (username, config = {}) => {
  const users = await findBy({ user_username: username }, config);
  
  if(users.length === 0) return null;

  return users[0];
}

const getHomeFeed = async (user_id) => {
  let feed = {
    recipes: []
  };
  
  const user = await findByUserId(user_id);
  const following = await UserFollowing.findByUserId(user.user_id);
  
  if(following.length === 0) return feed;

  const userIds = following.map(f => f.followed.user_id);
  
  feed.recipes = await Recipe.findByUserIds([user.user_id, ...userIds]);
  
  feed.recipes = feed.recipes.sort((a,b) => b.recipe_id - a.recipe_id);

  return feed;
}

const getActivityFeed = async (user_id) => {
  let feed = {
    recipe_likes: [],
    recipe_comments: []
  };

  const recipes = await Recipe.findByUserId(user_id);
  const recipe_ids = recipes.map(r => r.recipe_id);
  const recipe_likes = await RecipeLike.findByRecipeIds(recipe_ids);
  const recipe_comments = await RecipeComment.findByRecipeIds(recipe_ids);

  feed.recipe_likes = recipe_likes.sort((a,b) => b.recipe_like_id - a.recipe_like_id);
  feed.recipe_comments = recipe_comments.sort((a,b) => b.recipe_comment_id - a.recipe_comment_id);

  return feed;
}

module.exports = {
  findAll,
  findBy,
  findByEmail,
  findByUsername,
  findByUserId,
  getHomeFeed,
  getActivityFeed
}
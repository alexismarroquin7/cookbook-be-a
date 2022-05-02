const { boolToInt } = require('../../utils');
const db = require('../data/db-config');

const intToBool = int => int === 0 ? false : true;

const findAll = async () => {
  const rows = await db('recipe_likes as rp_like')
  .join('users as u', 'u.user_id', 'rp_like.user_id')
  .join('roles as r', 'r.role_id', 'u.role_id')

  if(rows.length === 0) return [];

  const recipe_likes = rows.map(row => {
    return {
      recipe_like_id: row.recipe_like_id,
      recipe_id: row.recipe_id,
      created_at: row.recipe_like_created_at,
      modified_at: row.recipe_like_modified_at,
      read: intToBool(row.recipe_like_read),
      user: {
        user_id: row.user_id,
        username: row.user_username,
        email: row.user_email,
        created_at: row.user_created_at,
        modified_at: row.user_modified_at,
        role: {
          role_id: row.role_id,
          name: row.role_name,
          description: row.role_description,
          created_at: row.role_created_at,
          modified_at: row.role_modified_at
        }
      }
    }
  });

  return recipe_likes;
}

const findBy = async (filter) => {
  const rows = await db('recipe_likes as rp_like')
  .join('users as u', 'u.user_id', 'rp_like.user_id')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .where(filter);

  if(rows.length === 0) return [];

  const recipe_likes = rows.map(row => {
    return {
      recipe_like_id: row.recipe_like_id,
      recipe_id: row.recipe_id,
      created_at: row.recipe_like_created_at,
      modified_at: row.recipe_like_modified_at,
      read: intToBool(row.recipe_like_read),
      user: {
        user_id: row.user_id,
        username: row.user_username,
        email: row.user_email,
        created_at: row.user_created_at,
        modified_at: row.user_modified_at,
        role: {
          role_id: row.role_id,
          name: row.role_name,
          description: row.role_description,
          created_at: row.role_created_at,
          modified_at: row.role_modified_at
        }
      }
    }
  });

  return recipe_likes;
}

const findByRecipeLikeId = async (recipe_like_id) => {
  const recipeLike = await findBy({recipe_like_id});

  if(recipeLike.length === 0) return null;

  return recipeLike[0];
}

const create = async ({ user_id, recipe_id }) => {
  const [rp_like] = await db('recipe_likes as rp_like')
  .insert({
    user_id,
    recipe_id
  }, ['rp_like.recipe_like_id']);

  const recipe_like = await findByRecipeLikeId(rp_like.recipe_like_id);

  return recipe_like;
}

const deleteByRecipeLikeId = async (recipe_like_id) => {
  const rp_like = await findByRecipeLikeId(recipe_like_id);

  await db('recipe_likes as rp_like')
  .where({
    recipe_like_id
  })
  .delete();

  return rp_like;
};

const findByRecipeId = async (recipe_id) => {
  const recipeLikes = await findBy({
    'rp_like.recipe_id': recipe_id 
  });

  if(recipeLikes.length === 0) return [];

  return recipeLikes;
}

const findByRecipeIds = async (recipe_ids = []) => {
  let recipe_likes = await findAll();
  
  recipe_likes = recipe_likes
  .filter(recipe_like => {
    let match = false;
    
    recipe_ids.forEach(recipe_id => {
      if(recipe_like.recipe_id === recipe_id){
        match = true;
      }
    });

    return match;
  });

  return recipe_likes;
}

const updateByRecipeLikeId = async (recipe_like_id, changes) => {
  const recipeLike = await findByRecipeLikeId(recipe_like_id);

  await db('recipe_likes')
  .where({
    recipe_like_id
  })
  .update({
    user_id: recipeLike.user.user_id,
    recipe_id: recipeLike.recipe_id,
    recipe_like_read: typeof changes.read === 'boolean'
    ? boolToInt(changes.read) 
    : recipeLike.read,
    recipe_like_created_at: recipeLike.created_at,
    recipe_like_modified_at: db.fn.now()
  })
  
  const updatedRecipeLike = await findByRecipeLikeId(recipe_like_id);
  
  return updatedRecipeLike;
}

module.exports = {
  findBy,
  findByRecipeLikeId,
  create,
  deleteByRecipeLikeId,
  findByRecipeId,
  findByRecipeIds,
  updateByRecipeLikeId
}
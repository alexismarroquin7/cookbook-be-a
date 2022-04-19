const db = require('../data/db-config');

const findBy = async (filter) => {
  const rows = await db('recipe_likes as rp_like')
  .join('users as u', 'u.user_id', 'rp_like.user_id')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .where(filter);

  if(rows.length === 0) return null;

  const recipe_likes = rows.map(row => {
    return {
      recipe_like_id: row.recipe_like_id,
      recipe_id: row.recipe_id,
      created_at: row.recipe_like_created_at,
      modified_at: row.recipe_like_modified_at,
      user: {
        user_id: row.user_id,
        username: row.user_username,
        email: row.user_email,
        created_at: row.user_created_at,
        modified_at: row.user_modified_at,
      },
      role: {
        role_id: row.role_id,
        name: row.role_name,
        description: row.role_description,
        created_at: row.role_created_at,
        modified_at: row.role_modified_at
      }
    }
  });

  return recipe_likes;
}

const findByRecipeLikeId = async (recipe_like_id) => {
  const recipe = await findBy({recipe_like_id});

  if(!recipe) return null;

  return recipe[0];
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

module.exports = {
  findBy,
  findByRecipeLikeId,
  create,
  deleteByRecipeLikeId
}
const db = require('../data/db-config');
const { intToBool, boolToInt } = require('../../utils');

const findAll = async () => {
  const rows = await db('recipe_comments as rp_com')
  .join('comments as com', 'rp_com.comment_id', 'com.comment_id')
  .join('users as u', 'u.user_id', 'com.user_id')
  .join('roles as r', 'r.role_id', 'u.role_id')

  const recipe_comments = rows.map(row => {
    return {
      recipe_comment_id: row.recipe_comment_id,
      created_at: row.recipe_comment_created_at,
      modified_at: row.recipe_comment_modified_at,
      read: intToBool(row.recipe_comment_read),
      
      comment: {
        comment_id: row.comment_id,
        text: row.comment_text,
        created_at: row.comment_created_at,
        modified_at: row.comment_modified_at,
      },
      user: {
        user_id: row.user_id,
        username: row.user_username,
        display_name: row.user_display_name,
        email: row.user_email,
        created_at: row.user_created_at,
        modified_at: row.user_modified_at,
        role: { 
          role_id: row.role_id,
          name: row.role_name,
          description: row.role_description,
          created_at: row.role_created_at,
          modified_at: row.role_modified_at,
        }
      },
      recipe_id: row.recipe_id
    }
  })
  return recipe_comments;
}

const findByRecipeCommentId = async (recipe_comment_id) => {
  const row = await db('recipe_comments as rp_com')
  .join('comments as com', 'rp_com.comment_id', 'com.comment_id')
  .join('users as u', 'u.user_id', 'com.user_id')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .where({
    'rp_com.recipe_comment_id': recipe_comment_id
  })
  .first()

  if(row.recipe_comment_id){
    return {
      recipe_comment_id: row.recipe_comment_id,
      created_at: row.recipe_comment_created_at,
      modified_at: row.recipe_comment_modified_at,
      read: intToBool(row.recipe_comment_read),
      
      comment: {
        comment_id: row.comment_id,
        text: row.comment_text,
        created_at: row.comment_created_at,
        modified_at: row.comment_modified_at,
      },
      user: {
        user_id: row.user_id,
        username: row.user_username,
        display_name: row.user_display_name,
        email: row.user_email,
        created_at: row.user_created_at,
        modified_at: row.user_modified_at,
        role: { 
          role_id: row.role_id,
          name: row.role_name,
          description: row.role_description,
          created_at: row.role_created_at,
          modified_at: row.role_modified_at,
        }
      },
      recipe_id: row.recipe_id
    }
  } else {
    return null;
  }
}

const create = async ({recipe_id, user_id, text}) => {
  
  const [comment] = await db('comments as com')
  .insert({
    user_id,
    comment_text: text
  }, ['com.comment_id']);

  const [rp_com] = await db('recipe_comments as rp_com')
  .insert({
    comment_id: comment.comment_id,
    recipe_id
  }, ['rp_com.recipe_comment_id'])
  
  const newRecipeComment = await findByRecipeCommentId(rp_com.recipe_comment_id);

  return newRecipeComment;
}

const findByRecipeId = async (recipe_id) => {
  const rows = await db('recipe_comments as rp_com')
  .join('comments as com', 'com.comment_id', 'rp_com.recipe_comment_id')
  .join('users as u', 'u.user_id', 'com.user_id')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .where({
    recipe_id
  })
  .orderBy('rp_com.recipe_comment_id', 'desc')

  if(rows.length === 0) return [];

  const recipe_comments = rows.map(rp_com => {
    return {
      recipe_comment_id: rp_com.recipe_comment_id,
      created_at: rp_com.recipe_comment_created_at,
      modified_at: rp_com.recipe_comment_modified_at,
      read: intToBool(rp_com.recipe_comment_read),
      
      comment: {
        comment_id: rp_com.comment_id,
        text: rp_com.comment_text,
        created_at: rp_com.comment_created_at,
        modified_at: rp_com.comment_modified_at,
      },

      recipe_id: rp_com.recipe_id,

      user: {
        user_id: rp_com.user_id,
        username: rp_com.user_username,
        display_name: rp_com.user_display_name,
        email: rp_com.user_email,
        created_at: rp_com.user_created_at,
        modified_at: rp_com.user_modified_at,
        role: {
          role_id: rp_com.role_id,
          name: rp_com.role_name,
          description: rp_com.role_description,
          created_at: rp_com.role_created_at,
          modified_at: rp_com.role_modified_at
        }
      }
    }
  })

  return recipe_comments;
}

const findByRecipeIds = async (recipe_ids = []) => {
  let recipe_comments = await findAll();
  
  recipe_comments = recipe_comments
  .filter(recipe_comment => {
    let match = false;
    
    recipe_ids.forEach(recipe_id => {
      if(recipe_comment.recipe_id === recipe_id){
        match = true;
      }
    });

    return match;
  });

  return recipe_comments;
}

const deleteByRecipeCommentId = async (recipe_comment_id) => {

  const recipe_comment = await findByRecipeCommentId(recipe_comment_id);

  await db('recipe_comments as rp_com')
  .where({
    recipe_comment_id: recipe_comment.recipe_comment_id
  })
  .delete();
  
  await db('comments as com')
  .where({
    comment_id: recipe_comment.comment.comment_id
  })
  .delete();

  return recipe_comment;
}

const updateByRecipeCommentId = async (recipe_comment_id, changes) => {
  const recipe_comment = await findByRecipeCommentId(recipe_comment_id);
  
  await db('recipe_comments')
  .where({
    recipe_comment_id
  })
  .update({
    recipe_comment_read: typeof changes.read === 'boolean' ? boolToInt(changes.read) : recipe_comment.read,
    recipe_comment_modified_at: db.fn.now()
  })
  
  const updated_recipe_comment = await findByRecipeCommentId(recipe_comment_id);

  return updated_recipe_comment;
}

module.exports = {
  findAll,
  findByRecipeCommentId,
  findByRecipeId,
  findByRecipeIds,
  create,
  deleteByRecipeCommentId,
  updateByRecipeCommentId
}
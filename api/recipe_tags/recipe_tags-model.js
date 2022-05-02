const db = require('../data/db-config');

const findByRecipeId = async (recipe_id) => {
  const rows = await db('recipe_tags as rp_tag')
  .join('tags as t', 't.tag_id', 'rp_tag.tag_id')
  .where({
    recipe_id
  });

  if(rows.length === 0) return [];

  const recipe_tags = rows.map(rp_tag => {
    return {
      recipe_tag_id: rp_tag.recipe_tag_id,
      index: rp_tag.recipe_tag_index,
      created_at: rp_tag.recipe_tag_created_at,
      modified_at: rp_tag.recipe_tag_modified_at,
      
      recipe_id: rp_tag.recipe_id,
      
      tag: {
        tag_id: rp_tag.tag_id,
        text: rp_tag.tag_text,
        created_at: rp_tag.tag_created_at,
        modified_at: rp_tag.tag_modified_at
      }

    }
  });
  return recipe_tags.sort((a, b) => a.index - b.index);
}

module.exports = {
  findByRecipeId
}
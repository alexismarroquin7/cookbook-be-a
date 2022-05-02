const db = require("../data/db-config")

const findByRecipeId = async (recipe_id) => {
  const rows = await db('recipe_steps as rp_step')
  .join('recipes as r', 'r.recipe_id', 'rp_step.recipe_id')
  .where({
    'rp_step.recipe_id': recipe_id
  })
  
  if(rows.length === 0) return [];

  let recipe_steps = rows.map(row => {
    return {
      recipe_step_id: row.recipe_step_id,
      text: row.recipe_step_text,
      index: row.recipe_step_index,
      recipe_id: row.recipe_id,
      created_at: row.recipe_step_created_at,
      modified_at: row.recipe_step_modified_at
    }
  });

  recipe_steps = recipe_steps.sort((a, b) => a.index - b.index);

  return recipe_steps;
}

module.exports = {
  findByRecipeId
}
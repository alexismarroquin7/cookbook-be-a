const db = require("../data/db-config")

const findByRecipeId = async (recipe_id) => {
  const rows = await db('recipe_ingredients as rp_ing')
  .join('ingredients as ing', 'ing.ingredient_id', 'rp_ing.ingredient_id')
  .join('ingredient_types as ing_type', 'ing_type.ingredient_type_id', 'ing.ingredient_type_id')
  .join('measurement_units as m_unit', 'm_unit.measurement_unit_id', 'rp_ing.measurement_unit_id')
  .where({
    recipe_id
  })
  .select(
    'rp_ing.recipe_ingredient_id',
    'rp_ing.recipe_ingredient_quantity',
    'rp_ing.recipe_ingredient_index',
    'rp_ing.recipe_ingredient_created_at',
    'rp_ing.recipe_ingredient_modified_at',
    
    'rp_ing.recipe_id',
    
    'rp_ing.ingredient_id',
    'ing.ingredient_name',
    'ing.ingredient_created_at',
    'ing.ingredient_modified_at',
    
    'ing.ingredient_type_id',
    'ing_type.ingredient_type_name',
    'ing_type.ingredient_type_created_at',
    'ing_type.ingredient_type_modified_at',
    
    'rp_ing.measurement_unit_id',
    'm_unit.measurement_unit_name',
    'm_unit.measurement_unit_created_at',
    'm_unit.measurement_unit_modified_at'
  );

  if(rows.length === 0) return [];
  
  let recipe_ingredients = rows.map(rp_ing => {
    return {
      recipe_ingredient_id: rp_ing.recipe_ingredient_id,
      quantity: Number(rp_ing.recipe_ingredient_quantity),
      index: rp_ing.recipe_ingredient_index,
      created_at: rp_ing.recipe_ingredient_created_at,
      modified_at: rp_ing.recipe_ingredient_modified_at,
      
      recipe_id: rp_ing.recipe_id,
      
      ingredient: {
        ingredient_id: rp_ing.ingredient_id,
        name: rp_ing.ingredient_name,
        created_at: rp_ing.ingredient_created_at,
        modified_at: rp_ing.ingredient_modified_at,
      },
      
      ingredient_type: {
        ingredient_type_id: rp_ing.ingredient_type_id,
        name: rp_ing.ingredient_type_name,
        created_at: rp_ing.ingredient_type_created_at,
        modified_at: rp_ing.ingredient_type_modified_at
      },
      
      measurement_unit: {
        measurement_unit_id: rp_ing.measurement_unit_id,
        name: rp_ing.measurement_unit_name,
        created_at: rp_ing.measurement_unit_created_at,
        modified_at: rp_ing.measurement_unit_modified_at
      }
    }
  })

  recipe_ingredients = recipe_ingredients.sort((a, b) => a.index - b.index)

  return recipe_ingredients;
}

module.exports = {
  findByRecipeId
}